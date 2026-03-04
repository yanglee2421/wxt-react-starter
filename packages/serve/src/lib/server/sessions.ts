import { JWTService } from "@/lib/server/jwt";
import { type DB, schema } from "@yanglee2421/db";
import { atFirstOrThrow } from "@yotulee/run";
import * as sql from "drizzle-orm";

export class SessionDatabaseService {
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

  isExpired(session: typeof schema.sessions.$inferSelect) {
    if (session.expiresAt === null) {
      return false;
    }

    return new Date(session.expiresAt).getTime() < Date.now();
  }
}

export class SessionService {
  #expiresIn: number;
  #databse: SessionDatabaseService;
  #jwt: JWTService;

  constructor(
    expiresIn: number,
    databse: SessionDatabaseService,
    jwt: JWTService,
  ) {
    this.#expiresIn = expiresIn;
    this.#databse = databse;
    this.#jwt = jwt;
  }

  async open(userId: number) {
    const expiresAt = new Date(Date.now() + this.#expiresIn);
    const sessions = await this.#databse.create(userId, expiresAt);
    const session = atFirstOrThrow(sessions);
    const refreshToken = this.#jwt.signRefreshJwt({
      userId,
      sessionId: session.id,
    });

    return refreshToken;
  }
  close(token: string) {
    const { sessionId } = this.#jwt.verifyRefreshJwt(token);

    return this.#databse.delete(sessionId);
  }
  async update(token: string) {
    const { sessionId } = this.#jwt.verifyRefreshJwt(token);
    const expiresAt = new Date(Date.now() + this.#expiresIn);
    const sessions = await this.#databse.update(sessionId, expiresAt);
    const session = atFirstOrThrow(sessions);

    return this.#jwt.signRefreshJwt({
      userId: session.userId,
      sessionId: session.id,
    });
  }
  async verify(token: string) {
    if (Math.random() < 0.01) {
      await this.#databse.clearExpired();
    }

    const { sessionId } = this.#jwt.verifyRefreshJwt(token);
    const sessions = await this.#databse.read(sessionId);
    const session = atFirstOrThrow(sessions);

    if (this.#databse.isExpired(session)) {
      await this.#databse.delete(sessionId);
      throw new Error("Session expired.");
    }

    return session;
  }
}
