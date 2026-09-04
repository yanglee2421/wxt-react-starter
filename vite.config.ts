import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {},
  lint: {
    plugins: ["eslint", "oxc", "typescript"],
    rules: {
      "typescript/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
    overrides: [
      {
        files: ["**/*.tsx"],
        plugins: ["eslint", "oxc", "typescript", "react", "react-perf"],
      },
    ],
  },
});
