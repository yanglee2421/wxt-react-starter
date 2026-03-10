import fs from "node:fs";
import zlib from "node:zlib";
import util from "node:util";
import path from "node:path";
import type { RequestHandler } from "express";

const gzip = util.promisify(zlib.gzip);

export const gzipHandle = (): RequestHandler => {
  return async (req, res, next) => {
    // Only Handle CSS & JS
    const isCss = req.url.endsWith(".css");
    const isJs = req.url.endsWith(".js");

    if (!isCss && !isJs) return next();

    // Not Allow Gzip
    const filePath = path.join(process.cwd(), req.originalUrl);
    const isAcceptGzip = req.headers["accept-encoding"]?.includes("gzip");
    if (!isAcceptGzip) return res.sendFile(filePath);

    // Has Allow Gzip
    const file = await fs.promises.readFile(filePath);
    const buffer = await gzip(file);
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", isCss ? "text/css" : "text/javascript");
    return res.send(buffer);
  };
};
