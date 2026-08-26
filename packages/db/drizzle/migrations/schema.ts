import { sqliteTable, index, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const sessions = sqliteTable("sessions", {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: integer().notNull(),
	expiresAt: integer(),
	createdAt: integer(),
	updatedAt: integer(),
},
(table) => [index("idx_sessions_expiresAt").on(table.expiresAt),
]);

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text(),
	email: text(),
	password: text(),
	createdAt: integer(),
	updatedAt: integer(),
});

