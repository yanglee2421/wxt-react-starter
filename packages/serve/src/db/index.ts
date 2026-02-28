import path from "node:path";
import url from "node:url";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import { relations } from "./relations";

export type DB = ReturnType<typeof createDB>;

export const createDB = () => {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const sqliteDatabase = new Database(path.resolve(__dirname, "./data.db"));
  const db = drizzle({ schema, client: sqliteDatabase, relations });

  migrate(db, {
    migrationsFolder: path.resolve(__dirname, "./migrations"),
  });

  return db;
};
