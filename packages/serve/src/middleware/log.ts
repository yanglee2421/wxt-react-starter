import fs from "node:fs";
import path from "node:path";
import type { RequestHandler } from "express";

export const logHandle = (): RequestHandler => {
  return async (req, res, next) => {
    void res;

    await fs.promises.writeFile(
      path.resolve(process.cwd(), "./dev.log"),
      `${new Date().toLocaleString()} ${req.path} ${req.method}\n`,
      { encoding: "utf-8", flag: "a" },
    );

    next();
  };
};
