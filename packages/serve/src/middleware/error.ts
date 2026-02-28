import { ErrorHelper } from "@/lib/server/error";
import type { ErrorRequestHandler } from "express";

export const errorHandler = (): ErrorRequestHandler => {
  return async (err, req, res, _next) => {
    console.error("Root Error Handler=>", req.path, "\n", err);

    const message = ErrorHelper.calculateErrorMessage(err);
    const statusCode = ErrorHelper.calculateErrorStatusCode(err);

    return res.status(statusCode).send({ message });
  };
};
