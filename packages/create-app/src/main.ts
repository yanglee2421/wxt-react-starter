#!/usr/bin/env node

// NodeJs Imports
import { resolve } from "node:path";

// Prompt Imports
import prompts from "prompts";

// Utils Imports
import { copyDir } from "./copy-dir";
import { editPackage } from "./edit-package";
import { toIoPath } from "./to-io-path";
import { editGitignore } from "./edit-gitignore";

// Kolorist Imports
import * as kolorist from "kolorist";

// Spawn Imports
import spawn from "cross-spawn";

// Minimist Imports
import minimist from "minimist";

const argv = minimist(process.argv.slice(2), { string: ["_"] });
console.log(argv);
console.log(kolorist.red("Operation cancelled"));
spawn.sync("pnpm -v");

init();

async function init() {
  const answer = await prompt();
  handleFile(answer);
}

function prompt(): Promise<Answer> {
  return prompts(
    [
      {
        type: "select",
        name: "framework",
        message: "select a framework",
        choices: getChoices(),
        initial: 0,
      },
      {
        type: "text",
        name: "projectName",
        message: "type a project name",
        initial: "my-app",
      },
    ],
    {
      onCancel(prompt, answers) {
        console.log("cancel");
      },
    }
  );
}
export interface Answer {
  projectName: string;
  framework: string;
}

async function handleFile(params: Answer) {
  // ** Params
  const { projectName } = params;

  // Get IO-Path With Answer
  const [input, output] = toIoPath(params);

  // Copy Files With IO-Path
  await copyDir({ input, output });

  // Edit package.json
  const jsonPath = resolve(output, "package.json");
  editPackage({ jsonPath, name: projectName });

  // Edit .gitignore
  const filePath = resolve(output, "_gitignore");
  editGitignore({ filePath });
}

function getChoices(): prompts.Choice[] {
  return [
    {
      title: "React + Antd",
      value: "react-antd",
      description: "React with Ant Design",
    },
    {
      title: "React + CRX",
      value: "react-crx",
      description: "React for Google Chrome CRX",
    },
    {
      title: "react + mui",
      value: "react-mui",
      description: "React with Material UI",
    },
    {
      title: "Vue + Element Plus",
      value: "vue-ele",
      description: "Vue with Element Plus",
    },
  ];
}
