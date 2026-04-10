#! pnpm tsx

import { serve } from "@hono/node-server";
import { createDatabase, schema } from "@yanglee2421/db";
import express from "express";
import { createFactory } from "hono/factory";
import http from "node:http";
import path from "node:path";
import url from "node:url";
import { WebSocket, WebSocketServer } from "ws";
import { createBingAxios } from "./api/bing/axiosBing";
import { HashService } from "./lib/server/hash";
import { JWTService } from "./lib/server/jwt";
import { SessionDatabaseService, SessionService } from "./lib/server/sessions";
import { corsHandle } from "./middleware/cors";
import { errorHandler } from "./middleware/error";
import { gzipHandle } from "./middleware/gzip";
import { logHandle } from "./middleware/log";
import { createAuthRouter } from "./routers/auth";
import { createBingRouter } from "./routers/bing";
import { createHMISRouter } from "./routers/hmis";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const databasePath = path.resolve(__dirname, "../data.db");
const db = createDatabase({
  databasePath,
  runMigrate: true,
});

const honoMain = () => {
  const factory = createFactory();
  const app = factory.createApp();
  app.get("/hello", (c) => {
    return c.text("Hello, Hono!");
  });
  app.get("/", async (c) => {
    const rows = await db.select().from(schema.users);

    return c.json({ rows });
  });
  const server = serve({ ...app, port: 8080 });

  // graceful shutdown
  process.on("SIGINT", () => {
    server.close();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    server.close((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  });
};

const main = async () => {
  const PORT = 3000;
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const bingAxios = createBingAxios();
  const hashService = new HashService(10);
  const jwtService = new JWTService();
  const sessionDBService = new SessionDatabaseService(db);
  const sessionService = new SessionService(
    // expiresIn: 24 hours
    1000 * 60 * 60 * 24 * 7,
    sessionDBService,
    jwtService,
  );

  app.use(corsHandle());
  app.use(logHandle());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    "/public",
    gzipHandle(),
    express.static(path.resolve(process.cwd(), "./public")),
  );
  app.use(
    "/api/auth",
    createAuthRouter(db, hashService, jwtService, sessionService),
  );
  app.use("/bing", createBingRouter(bingAxios));
  app.use(createHMISRouter(PORT));
  app.use(errorHandler());

  let data = "msg";

  wss.on("connection", (ws) => {
    ws.on("error", console.error);
    ws.on("message", (message) => {
      data = message.toString();

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });

    ws.send(data);
  });

  server.listen(PORT, () => {
    console.info("> standing by", PORT);
  });
};

main();
honoMain();
