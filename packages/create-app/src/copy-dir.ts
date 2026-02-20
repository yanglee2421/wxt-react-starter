// NodeJs Imports
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
  // ** Params
  const { input, output } = params;

  // Output must can be accessed
  try {
    await access(output, constants.R_OK);
  } catch {
    await mkdir(output);
  }

  // List Directory Contents
  const list = await readdir(input);
  for (const item of list) {
    const neoInput = resolve(input, item);
    const neoOutput = resolve(output, item);

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
