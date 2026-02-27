import path from "node:path";
import url from "node:url";
import { defineConfig } from "tsdown";

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

export default defineConfig(() => {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

  return {
    entry: ["src/index.ts"],
    dts: true,
    format: {
      esm: {
        target: ["ES2023"],
      },
      cjs: {
        target: ["node20"],
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

    target: "node20",
    platform: "node",

    minify: true,
    inlineOnly: false as const,
    fixedExtension: false,
    plugins: [],
  };
});
