import { defineConfig } from "drizzle-kit";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${path.join(__dirname, "./src/db/data.db")}`,
  },
});
