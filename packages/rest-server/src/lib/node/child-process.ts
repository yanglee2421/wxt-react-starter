#! pnpm tsx
import { exec } from "node:child_process";

export function childProcess() {
  return new Promise<string>((res, rej) => {
    exec("git --version", (err, stdout, stderr) => {
      if (err) {
        rej(err);
        return;
      }

      if (stdout) {
        console.log(stdout);
        res(stdout);
        return;
      }

      if (stderr) {
        console.error(stderr);
        res(stderr);
      }
    });
  });
}

await childProcess();
