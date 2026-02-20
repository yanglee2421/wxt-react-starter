import { resolve } from "node:path";
import {
  copyFile,
  access,
  readdir,
  constants,
  stat,
  mkdir,
} from "node:fs/promises";

export async function copyDir(params: CopyDirParams) {
  // Output must can be accessed
  try {
    await access(params.output, constants.R_OK);
  } catch {
    await mkdir(params.output);
  }

  // List Directory Contents
  const list = await readdir(params.input);
  for (const item of list) {
    const neoInput = resolve(params.input, item);
    const neoOutput = resolve(params.output, item);

    const states = await stat(neoInput);
    const isDir = states.isDirectory();

    // Is Directoy
    if (isDir) {
      await copyDir({
        input: neoInput,
        output: neoOutput,
      });
      continue;
    }

    // Is File
    await copyFile(neoInput, neoOutput);
  }
}

interface CopyDirParams {
  input: string;
  output: string;
}
