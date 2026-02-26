#! pnpm tsx

import { createServer } from "node:http";
import { resolve, join } from "node:path";
import { writeFile, readFile, appendFile } from "node:fs/promises";
import { gzip } from "node:zlib";
import type { InputType } from "node:zlib";
import cors from "cors";
import express from "express";
import type { RequestHandler, ErrorRequestHandler } from "express";
import { WebSocket, WebSocketServer } from "ws";
import { hmisRouter, PORT } from "./routers/hmis";

function errorHandler(): ErrorRequestHandler {
  return async (err, req, res, next) => {
    void req;
    void next;

    console.error(err);

    const path = resolve(process.cwd(), "./dev.log");
    await appendFile(path, `${String(err)}\n`, "utf-8");

    return res.status(500).send({
      msg: err.message,
      cause: err.cause,
    });
  };
}

function middLog(): RequestHandler {
  return async (req, res, next) => {
    void res;

    await writeFile(
      resolve(process.cwd(), "./dev.log"),
      `${new Date().toLocaleString()} ${req.path} ${req.method}\n`,
      { encoding: "utf-8", flag: "a" },
    );

    next();
  };
}

function corsHandle() {
  return cors((req, callback) => {
    const origin = ["http://localhost", "http://127.0.0.1"].includes(
      req.headers.origin || "",
    );
    callback(null, { origin });
  });
}

function toGzip(buffer: InputType) {
  return new Promise<Buffer>((res, rej) =>
    gzip(buffer, (err, compressed) => (err ? rej(err) : res(compressed))),
  );
}

function gzipHandle(): RequestHandler {
  return async (req, res, next) => {
    try {
      // Only Handle CSS & JS
      const isCss = req.url.endsWith(".css");
      const isJs = req.url.endsWith(".js");

      if (!isCss && !isJs) return next();

      // Not Allow Gzip
      const filePath = join(process.cwd(), req.originalUrl);
      const isAcceptGzip = req.headers["accept-encoding"]?.includes("gzip");
      if (!isAcceptGzip) return res.sendFile(filePath);

      // Has Allow Gzip
      const file = await readFile(filePath);
      const buffer = await toGzip(file);
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Content-Type", isCss ? "text/css" : "text/javascript");
      return res.send(buffer);
    } catch (err) {
      return next(err);
    }
  };
}

const app = express();

app.use(corsHandle());
app.use(middLog());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  "/public",
  gzipHandle(),
  express.static(resolve(process.cwd(), "./public")),
);

app.use(hmisRouter);
app.use(errorHandler());

const server = createServer(app);
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

server.listen(PORT, () => {
  console.info("standing by", PORT);
});
