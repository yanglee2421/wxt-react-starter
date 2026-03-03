import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import url from "node:url";
import { relations } from "./relations";
import * as schema from "./schema";

export type DB = ReturnType<typeof createDatabase>;

export const createDatabase = () => {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const sqliteDatabase = new Database(path.resolve(__dirname, "./data.db"));
  const db = drizzle({ schema, client: sqliteDatabase, relations });

  if (process.env.NODE_ENV === "production") {
    migrate(db, {
      migrationsFolder: path.resolve(__dirname, "./migrations"),
    });
  }

  return db;
};
