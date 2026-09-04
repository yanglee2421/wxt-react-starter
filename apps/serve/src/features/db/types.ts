import type { relations, schema } from "@yanglee2421/db";
import type { NodeSQLiteDatabase } from "drizzle-orm/node-sqlite";
import type { DatabaseSync } from "node:sqlite";

export type DBClient = NodeSQLiteDatabase<typeof schema, typeof relations> & {
  $client: DatabaseSync;
};
