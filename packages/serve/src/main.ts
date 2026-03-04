#! pnpm tsx

import { createDatabase } from "@yanglee2421/db";
import express from "express";
import http from "node:http";
import path from "node:path";
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

const main = async () => {
  const PORT = 3000;
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const db = createDatabase();
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
