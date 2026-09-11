import { fork } from "node:child_process";
import path from "node:path";
import url from "node:url";
import type { RolldownWatcher, WatchOptions } from "rolldown";
import { watch } from "rolldown";
import { catchError, EMPTY, Observable, switchMap, tap } from "rxjs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shimFile = path.resolve(__dirname, "esm-shims.ts");

const startNode = (watcher: RolldownWatcher) => {
  return new Observable((sub) => {
    const jsPath = path.resolve(__dirname, "../dist/index.mjs");
    const ps = fork(jsPath, { stdio: "inherit" });

    ps.on("spawn", () => {
      sub.next(ps);
    });
    ps.on("error", (error) => {
      sub.error(error);
    });
    ps.on("close", () => {
      sub.complete();
    });

    return () => {
      ps.removeAllListeners();
      ps.kill();
    };
  }).pipe(
    tap({
      complete() {
        watcher.close();
      },
    }),
    catchError((error) => {
      console.error(error);
      return EMPTY;
    }),
  );
};

const watchOptions = (): WatchOptions => {
  return {
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

const watch$ = new Observable<RolldownWatcher>((sub) => {
  const watcher = watch(watchOptions());

  watcher.on("event", (e) => {
    switch (e.code) {
      case "ERROR":
        console.error(e.error);
        break;
      case "BUNDLE_END":
        sub.next(watcher);
        break;
      default:
    }
  });

  return () => {
    watcher.clear("event");
    watcher.close();
  };
});

const dev$ = watch$.pipe(switchMap((watcher) => startNode(watcher)));

dev$.subscribe();
