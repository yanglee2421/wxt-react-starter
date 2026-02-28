import { z } from "zod";
import { Router } from "express";
import * as schema from "@/db/schema";
import * as sql from "drizzle-orm";
import { HttpError } from "@/lib/server/error";
import type { DB } from "@/db";
import type { Hash } from "@/lib/server/hash";
import type { JWTHelper } from "@/lib/server/jwt";
import type { Sessions } from "@/lib/server/sessions";

export const createAuthRouter = (
  db: DB,
  hash: Hash,
  jwtHelper: JWTHelper,
  sessions: Sessions,
) => {
  const authRouter = Router();

  const loginSchema = z.object({
    email: z.email().min(10),
    password: z.string().min(6),
  });

  authRouter.post("/login", async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const [user] = await db
      .select()
      .from(schema.users)
      .where(sql.eq(schema.users.email, email))
      .limit(1);

    if (!user) {
      return res.status(422).json({ message: "Invalid email or password" });
    }

    if (typeof user.password !== "string") {
      return res.status(422).json({
        message:
          "Current user unset password, can not login by email and password",
      });
    }

    const isPasswordValid = await hash.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(422).json({ message: "Invalid email or password" });
    }

    const accessToken = jwtHelper.signAccessJwt({ userId: user.id });
    const refreshToken = await sessions.open(user.id);

    return res.json({
      message: "Login successful",
      user: {
        ...user,
        password: void 0,
      },
      accessToken,
      refreshToken,
    });
  });

  authRouter.post("/logout", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = jwtHelper.authorizationHeaderToToken(authHeader);

    jwtHelper.verifyAccessJwt(token);
    await sessions.close(token);

    return res.json({ message: "Logout successful" });
  });

  authRouter.post("/signup", async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const [existingUser] = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      })
      .from(schema.users)
      .where(sql.eq(schema.users.email, email))
      .limit(1);

    if (existingUser) {
      throw new HttpError("Email already exists", 422);
    }

    const hashPassword = await hash.hashPassword(password);

    const [newUser] = await db
      .insert(schema.users)
      .values({ email, password: hashPassword })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      });

    const accessToken = jwtHelper.signAccessJwt({ userId: newUser.id });
    const refreshToken = await sessions.open(newUser.id);

    return res.json({
      message: "Signup successful",
      user: newUser,
      accessToken,
      refreshToken,
    });
  });

  authRouter.post("/refresh", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = jwtHelper.authorizationHeaderToToken(authHeader);
    const session = await sessions.verify(token);
    const accessToken = jwtHelper.signAccessJwt({ userId: session.userId });
    const refreshToken = await sessions.update(token);

    return res.json({
      message: "Token refreshed",
      accessToken,
      refreshToken,
      userId: session.userId,
    });
  });

  authRouter.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = jwtHelper.authorizationHeaderToToken(authHeader);
    const decoded = jwtHelper.verifyAccessJwt(token);

    const [user] = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      })
      .from(schema.users)
      .where(sql.eq(schema.users.id, decoded.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User profile", user });
  });

  return authRouter;
};
