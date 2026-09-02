import { spawn } from "node:child_process";
import path from "node:path";
import url from "node:url";
import { watch } from "rolldown";
import {
  catchError,
  EMPTY,
  fromEventPattern,
  merge,
  Observable,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shimFile = path.resolve(__dirname, "esm-shims.ts");

const exit$ = fromEventPattern(
  (f) => process.on("exit", f),
  (f) => process.off("exit", f),
);
const sigint$ = fromEventPattern(
  (f) => process.on("SIGINT", f),
  (f) => process.off("SIGINT", f),
).pipe(
  tap(() => {
    process.exit();
  }),
);
const sigterm$ = fromEventPattern(
  (f) => process.on("SIGTERM", f),
  (f) => process.off("SIGTERM", f),
).pipe(
  tap(() => {
    process.exit();
  }),
);
const node$ = new Observable((sub) => {
  const jsPath = path.resolve(__dirname, "./dist/index.mjs");
  const ps = spawn("node", [jsPath], {
    stdio: "inherit",
  });

  ps.on("error", (error) => {
    sub.error(error);
  });
  ps.on("spawn", () => {
    console.clear();
    sub.next(ps);
  });
  ps.on("close", () => {
    sub.complete();
    process.exit();
  });

  return () => {
    ps.removeAllListeners();
    ps.kill("SIGHUP");
  };
}).pipe(
  catchError((error) => {
    console.error(error);

    return EMPTY;
  }),
);

const watch$ = new Observable((sub) => {
  const watcher = watch({
    // Input
    input: "./src/main.tsx",
    output: {
      file: "./dist/index.mjs",
      format: "esm",
    },
    platform: "node",
    transform: {
      inject: {
        __dirname: [shimFile, "__dirname"],
        __filename: [shimFile, "__filename"],
      },
    },
    external: (id, parentId, isResolved) => {
      void parentId;
      // console.log(id);
      // console.log(parentId);
      // console.log(isResolved);

      if (isResolved) {
        return id.includes("node_modules");
      } else {
        if (id.startsWith(".")) {
          return false;
        }

        if (id.startsWith("@/")) {
          return false;
        }

        if (id.startsWith("/")) {
          return false;
        }

        return true;
      }
    },
  });

  watcher.on("event", (e) => {
    switch (e.code) {
      case "ERROR":
        console.error(e.error);
        break;
      case "BUNDLE_END":
        sub.next(null);
        break;
      default:
    }
  });

  return () => {
    watcher.clear("event");
    watcher.close();
  };
});

const dev$ = watch$.pipe(
  switchMap(() => node$),
  takeUntil(merge(exit$, sigint$, sigterm$)),
);

dev$.subscribe();
