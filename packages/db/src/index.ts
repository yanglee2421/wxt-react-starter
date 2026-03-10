import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import url from "node:url";
import { relations } from "./relations";
import * as schema from "./schema";

export type DB = ReturnType<typeof createDatabase>;

type CreateDatabaseOptions = {
  databasePath: string;
  runMigrate?: boolean;
  migrationsFolder?: string;
};

export const createDatabase = (options?: CreateDatabaseOptions) => {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const defaultDatabasePath = path.resolve(__dirname, "../data.db");
  const defaultMigrationsFolder = path.resolve(
    __dirname,
    "../drizzle/migrations",
  );
  const migrationsFolder = options?.migrationsFolder || defaultMigrationsFolder;
  const databasePath = options?.databasePath || defaultDatabasePath;
  const sqliteDatabase = new Database(databasePath);
  const db = drizzle({ schema, client: sqliteDatabase, relations });

  if (options?.runMigrate) {
    migrate(db, { migrationsFolder });
  }

  return db;
};

export { schema };
