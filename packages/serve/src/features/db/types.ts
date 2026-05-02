import type { relations, schema } from "@yanglee2421/db";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export type DBClient = BetterSQLite3Database<typeof schema, typeof relations>;
