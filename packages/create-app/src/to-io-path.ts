// NodeJs Imports
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Types Imports
import type { Answer } from "./main";

export function toIoPath(params: Answer): [string, string] {
  // ** Params
  const { projectName, framework } = params;

  // Get Input Path
  const __dirname = getDirname();
  const inputBasePath = resolve(__dirname, "../templates");
  const input = resolve(inputBasePath, framework);

  // Get Output Path
  const output = resolve(process.cwd(), projectName);

  return [input, output];
}

function getDirname() {
  return fileURLToPath(dirname(import.meta.url));
}
