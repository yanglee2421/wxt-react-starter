#!/usr/bin/env node
import mri from "mri";
import spawn from "cross-spawn";
export * from "./fs";

type Argv = {
  template?: string;
  help?: boolean;
  overwrite?: boolean;
  immediate?: boolean;
  interactive?: boolean;
};

export const main = async () => {
  const argv = mri<Argv>(process.argv.slice(2), {
    boolean: ["help", "overwrite", "immediate", "interactive"],
    alias: { h: "help", t: "template", i: "immediate" },
    string: ["template"],
  });

  const childProcess = spawn("node", ["-v"], { stdio: "inherit" });
  console.log(argv, childProcess);
};

// main();
