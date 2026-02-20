// NodeJs Imports
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Unbuild Imports
import { defineBuildConfig } from "unbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineBuildConfig({
  entries: ["src/main.ts"],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: "node18",
      minify: true,
    },
  },
  alias: {
    // we can always use non-transpiled code since we support node 18+
    prompts: "prompts/lib/index.js",

    "@": resolve(__dirname, "./src"),
  },
});
