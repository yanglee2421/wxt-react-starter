import path from "node:path";
import url from "node:url";
export { relations } from "./relations";
export * as schema from "./schema";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const migrationsFolder = path.resolve(
  __dirname,
  "../drizzle/migrations",
);

export const defaultDbUrl = path.join(__dirname, "../data.db");
