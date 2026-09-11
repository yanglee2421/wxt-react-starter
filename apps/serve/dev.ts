import { spawn } from "node:child_process";
import path from "node:path";
import url from "node:url";
import { watch, type WatchOptions } from "rolldown";
import { catchError, EMPTY, last, Observable, share, switchMap, takeUntil } from "rxjs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shimFile = path.resolve(__dirname, "esm-shims.ts");

const node$ = new Observable((sub) => {
  const jsPath = path.resolve(__dirname, "./dist/serve.mjs");
  const ps = spawn("node", [jsPath], {
    stdio: "inherit",
  });

  ps.on("error", (error) => {
    sub.error(error);
  });
  ps.on("spawn", () => {
    sub.next(ps);
  });
  ps.on("close", () => {
    sub.complete();
  });

  return () => {
    ps.removeAllListeners();
    ps.kill("SIGHUP");
  };
}).pipe(
  share(),
  catchError((error) => {
    console.error(error);

    return EMPTY;
  }),
);

const watchOptions = (): WatchOptions => {
  return {
    input: "./src/serve.ts",
    output: {
      file: "./dist/serve.mjs",
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
  };
};

const watch$ = new Observable((sub) => {
  const watcher = watch(watchOptions());

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
  takeUntil(node$.pipe(last())),
);
dev$.subscribe();
