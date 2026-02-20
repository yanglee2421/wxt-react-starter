import { fileURLToPath } from "node:url";
import {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} from "node:worker_threads";

export function workerThreader() {
  if (isMainThread) {
    const worker = new Worker(fileURLToPath(import.meta.url), {
      workerData: { msg: "hello worker threader" },
    });

    worker.on("message", (data) => {
      console.log(data);
      worker.terminate();
    });

    worker.on("error", (error) => {
      console.error(error);
    });

    worker.on("exit", (exitCode) => {
      console.log(exitCode);
    });

    return;
  }

  console.log(workerData);
  setTimeout(() => {
    parentPort?.postMessage({ msg: "hello parent" });
  }, 1000);
}

workerThreader();
