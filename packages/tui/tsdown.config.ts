import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/main.tsx",
  outDir: "./dist",
  target: "ES2024",
  platform: "node",
  //   hooks: (hooks) => {
  //     hooks.hook("build:done", () => {
  //       import("./dist/main.mjs");
  //     });
  //   },
});
