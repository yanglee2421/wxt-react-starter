import { defineConfig } from "drizzle-kit";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${path.join(__dirname, "./local.db")}`,
  },
});
