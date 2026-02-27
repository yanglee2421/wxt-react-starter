import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { ErrorRequestHandler } from "express";

type CallbackFn<TArgs extends unknown[], TReturn> = (...args: TArgs) => TReturn;

const mapGroupBy = <TElement, TKey>(
  items: TElement[],
  callbackFn: CallbackFn<[TElement, number], TKey>,
): Map<TKey, TElement[]> => {
  const resultMap = new Map<TKey, TElement[]>();

  items.reduce((latestResult, item, index) => {
    const mapKey = callbackFn(item, index);
    const mapValue = latestResult.get(mapKey);

    if (Array.isArray(mapValue)) {
      mapValue.push(item);
    } else {
      latestResult.set(mapKey, [item]);
    }

    return latestResult;
  }, resultMap);

  return resultMap;
};

const calculateErrorMessage = (
  err: unknown,
  fallback = "An error occurred",
): string => {
  if (err instanceof z.ZodError) {
    return JSON.stringify(
      Object.fromEntries(
        Array.from(
          mapGroupBy(err.issues, (issue) => issue.path.join(".")),
          ([key, issues]) => [key, issues.map((i) => i.message).join(", ")],
        ),
      ),
    );
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  return fallback;
};

export const errorHandler = (): ErrorRequestHandler => {
  return async (err, _req, res, _next) => {
    console.error(err);

    const logPath = path.resolve(process.cwd(), "./dev.log");
    await fs.promises.appendFile(logPath, `${String(err)}\n`, "utf-8");

    return res.status(500).send({
      message: calculateErrorMessage(err),
      cause: err.cause,
    });
  };
};
