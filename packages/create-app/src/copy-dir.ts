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

const ensureDir = async (dir: string) => {
  // Output must can be accessed
  try {
    await access(dir, constants.R_OK);
  } catch {
    await mkdir(dir, { recursive: true });
    return;
  }

  const dirState = await stat(dir);

  if (!dirState.isDirectory()) {
    throw new Error(`Output path ${dir} is not a directory.`);
  }
};

export const copyDir = async (source: string, destination: string) => {
  const inputState = await stat(source);

  if (!inputState.isDirectory()) {
    throw new Error(`Input path ${source} is not a file or directory.`);
  }

  await ensureDir(destination);

  // List Directory Contents
  const basenames = await readdir(source);

  // Loop for Each Item
  for (const basename of basenames) {
    const subSource = resolve(source, basename);
    const subDestination = resolve(destination, basename);

    const states = await stat(subSource);

    // Is Directory
    if (states.isDirectory()) {
      await copyDir(subSource, subDestination);
      continue;
    }

    // Is File
    if (states.isFile()) {
      await copyFile(subSource, subDestination, constants.COPYFILE_EXCL);
    }
  }
};
