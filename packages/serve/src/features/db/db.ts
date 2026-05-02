import { relations, schema } from "@yanglee2421/db";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { AppCradle } from "../types";
import type { DBClient } from "./types";

export class DBService {
  readonly client: DBClient;

  constructor({ dbPath }: AppCradle) {
    const dbClient = new Database(dbPath);
    this.client = drizzle({ client: dbClient, schema, relations });
  }
}
