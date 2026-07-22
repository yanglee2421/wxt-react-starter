import path from "node:path";
import url from "node:url";
import { defineConfig } from "tsdown";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const calcualteJSExtension = (format: string) => {
  switch (format) {
    case "es":
      return ".mjs";
    case "cjs":
      return ".cjs";
    default:
      return ".js";
  }
};

const calcualteDTSExtension = (format: string) => {
  switch (format) {
    case "es":
      return ".d.mts";
    case "cjs":
      return ".d.cts";
    default:
      return ".d.ts";
  }
};

export default defineConfig((conf) => {
  return {
    entry: ["src/main.tsx"],
    dts: false,
    format: {
      esm: {
        target: ["ES2023"],
      },
    },
    outDir: path.resolve(__dirname, "dist"),
    outExtensions: ({ format }) => {
      return {
        js: calcualteJSExtension(format),
        dts: calcualteDTSExtension(format),
      };
    },
    clean: true,

    target: "node24",
    platform: "node",

    minify: !conf.watch,
    fixedExtension: false,
    plugins: [],
    deps: {
      skipNodeModulesBundle: true,
    },
  };
});
