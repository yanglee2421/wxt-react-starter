#! pnpm tsx

import http from "node:http";
import path from "node:path";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { logHandle } from "./middleware/log";
import { corsHandle } from "./middleware/cors";
import { gzipHandle } from "./middleware/gzip";
import { errorHandler } from "./middleware/error";
import { createAuthRouter } from "./routers/auth";
import { createBingRouter } from "./routers/bing";
import { createHMISRouter } from "./routers/hmis";
import { createDB } from "@/db";
import { Hash } from "./lib/server/hash";
import { JWTHelper } from "./lib/server/jwt";
import { Sessions, SessionDBHelper } from "./lib/server/sessions";
import { createAxiosBing } from "./api/bing/axiosBing";

const main = async () => {
  const PORT = 3000;
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const db = createDB();
  const axiosBing = createAxiosBing();
  const hash = new Hash(10);
  const jwtHelper = new JWTHelper();
  const sessionDBHelper = new SessionDBHelper(db);
  const sessions = new Sessions(
    // expiresIn: 24 hours
    1000 * 60 * 60 * 24 * 7,
    sessionDBHelper,
    jwtHelper,
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
  app.use("/api/auth", createAuthRouter(db, hash, jwtHelper, sessions));
  app.use("/bing", createBingRouter(axiosBing));
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
    console.info("standing by", PORT);
  });
};

main();
