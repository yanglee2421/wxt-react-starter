import process from "node:process";
import { fromEventPattern, merge } from "rxjs";

export const exit$ = fromEventPattern(
  (f) => process.on("exit", f),
  (f) => process.off("exit", f),
);
export const sigint$ = fromEventPattern(
  (f) => process.on("SIGINT", f),
  (f) => process.off("SIGINT", f),
);
export const sigterm$ = fromEventPattern(
  (f) => process.on("SIGTERM", f),
  (f) => process.off("SIGTERM", f),
);

export const processExit$ = merge(exit$, sigint$, sigterm$);
