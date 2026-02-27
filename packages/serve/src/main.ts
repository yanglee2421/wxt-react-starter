#! pnpm tsx

import http from "node:http";
import path from "node:path";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { hmisRouter } from "./routers/hmis";
import { logHandle } from "./middleware/log";
import { errorHandler } from "./middleware/error";
import { corsHandle } from "./middleware/cors";
import { gzipHandle } from "./middleware/gzip";
import { authRouter } from "./routers/auth";
import { bingRouter } from "./routers/bing";

const app = express();

app.use(corsHandle());
app.use(logHandle());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  "/public",
  gzipHandle(),
  express.static(path.resolve(process.cwd(), "./public")),
);
app.use("/api/auth", authRouter);
app.use("/bing", bingRouter);
app.use(hmisRouter);
app.use(errorHandler());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
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

const PORT = 3000;
server.listen(PORT, () => {
  console.info("standing by", PORT);
});
