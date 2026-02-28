import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const sessions = sqliteTable(
  "sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId").notNull(),
    expiresAt: integer("expiresAt", { mode: "timestamp" }),
    createdAt: integer("createdAt", { mode: "timestamp" }),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [index("idx_sessions_expiresAt").on(table.expiresAt)],
);
