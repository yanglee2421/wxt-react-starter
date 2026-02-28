import { db } from "@/db";
import * as schema from "@/db/schema";
import * as sql from "drizzle-orm";
import { jwtHelper, JWTHelper } from "@/lib/server/jwt";
import { NotFoundError } from "./error";

class SessionDBHelper {
  create(userId: number, expiresAt: Date) {
    return db.insert(schema.sessions).values({ userId, expiresAt }).returning();
  }
  delete(sessionId: number) {
    return db
      .delete(schema.sessions)
      .where(sql.eq(schema.sessions.id, sessionId))
      .returning();
  }
  update(sessionId: number, expiresAt: Date) {
    return db
      .update(schema.sessions)
      .set({ expiresAt })
      .where(sql.eq(schema.sessions.id, sessionId))
      .returning();
  }
  read(sessionId: number) {
    return db
      .select()
      .from(schema.sessions)
      .where(sql.eq(schema.sessions.id, sessionId))
      .limit(1);
  }

  clearExpired() {
    return db
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

  atOneOrThrow<TElement>(elements: TElement[]): TElement {
    const [element] = elements;

    if (!element) {
      throw new NotFoundError("Element not found.");
    }

    return element;
  }
}

class Sessions {
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
    const session = this.#dbHelper.atOneOrThrow(sessions);
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
    const session = this.#dbHelper.atOneOrThrow(sessions);

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
    const session = this.#dbHelper.atOneOrThrow(sessions);

    if (this.#dbHelper.isExpired(session)) {
      await this.#dbHelper.delete(sessionId);
      throw new Error("Session expired.");
    }

    return session;
  }
}

const sessionDBHelper = new SessionDBHelper();
export const sessions = new Sessions(
  // expiresIn: 24 hours
  1000 * 60 * 60 * 24 * 7,
  sessionDBHelper,
  jwtHelper,
);
