import type { DB } from "@/db";
import * as schema from "@/db/schema";
import { JWTHelper } from "@/lib/server/jwt";
import { atFirstOrThrow } from "@yotulee/run";
import * as sql from "drizzle-orm";

export class SessionDBHelper {
  #db: DB;

  constructor(db: DB) {
    this.#db = db;
  }

  create(userId: number, expiresAt: Date) {
    return this.#db
      .insert(schema.sessions)
      .values({ userId, expiresAt })
      .returning();
  }
  delete(sessionId: number) {
    return this.#db
      .delete(schema.sessions)
      .where(sql.eq(schema.sessions.id, sessionId))
      .returning();
  }
  update(sessionId: number, expiresAt: Date) {
    return this.#db
      .update(schema.sessions)
      .set({ expiresAt })
      .where(sql.eq(schema.sessions.id, sessionId))
      .returning();
  }
  read(sessionId: number) {
    return this.#db
      .select()
      .from(schema.sessions)
      .where(sql.eq(schema.sessions.id, sessionId))
      .limit(1);
  }

  clearExpired() {
    return this.#db
      .delete(schema.sessions)
      .where(sql.lt(schema.sessions.expiresAt, new Date()))
      .returning();
  }

  isExpired(session: schema.Session) {
    if (session.expiresAt === null) {
      return false;
    }

    return new Date(session.expiresAt).getTime() < Date.now();
  }
}

export class Sessions {
  #expiresIn: number;
  #dbHelper: SessionDBHelper;
  #jwtHelper: JWTHelper;

  constructor(
    expiresIn: number,
    dbHelper: SessionDBHelper,
    jwtHelper: JWTHelper,
  ) {
    this.#expiresIn = expiresIn;
    this.#dbHelper = dbHelper;
    this.#jwtHelper = jwtHelper;
  }

  async open(userId: number) {
    const expiresAt = new Date(Date.now() + this.#expiresIn);
    const sessions = await this.#dbHelper.create(userId, expiresAt);
    const session = atFirstOrThrow(sessions);
    const refreshToken = this.#jwtHelper.signRefreshJwt({
      userId,
      sessionId: session.id,
    });

    return refreshToken;
  }
  close(token: string) {
    const { sessionId } = this.#jwtHelper.verifyRefreshJwt(token);

    return this.#dbHelper.delete(sessionId);
  }
  async update(token: string) {
    const { sessionId } = this.#jwtHelper.verifyRefreshJwt(token);
    const expiresAt = new Date(Date.now() + this.#expiresIn);
    const sessions = await this.#dbHelper.update(sessionId, expiresAt);
    const session = atFirstOrThrow(sessions);

    return this.#jwtHelper.signRefreshJwt({
      userId: session.userId,
      sessionId: session.id,
    });
  }
  async verify(token: string) {
    if (Math.random() < 0.01) {
      await this.#dbHelper.clearExpired();
    }

    const { sessionId } = this.#jwtHelper.verifyRefreshJwt(token);
    const sessions = await this.#dbHelper.read(sessionId);
    const session = atFirstOrThrow(sessions);

    if (this.#dbHelper.isExpired(session)) {
      await this.#dbHelper.delete(sessionId);
      throw new Error("Session expired.");
    }

    return session;
  }
}
