import { z } from "zod";
import { Router } from "express";
import { hash } from "@/lib/node/hash";
import { jwtInstance } from "@/lib/node/jwt";
import { db } from "@/db";
import * as schema from "@/db/schema";
import * as sql from "drizzle-orm";

export const authRouter = Router();

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

  const accessToken = jwtInstance.signAccessJwt(user);
  const refreshToken = jwtInstance.signRefreshJwt(user);

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

authRouter.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    jwtInstance.verifyAccessJwt(token);
  } catch (error) {
    let message = "Invalid token";

    // if (error instanceof jwtInstance.TokenExpiredError) {
    //   message = "Token expired";
    // }

    return res.status(401).json({ message });
  }

  res.json({ message: "Logout successful" });
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
    return res.status(422).json({ message: "Email already exists" });
  }

  if (typeof password !== "string") {
    return res.status(422).json({ message: "Invalid password" });
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

  const accessToken = jwtInstance.signAccessJwt(newUser);
  const refreshToken = jwtInstance.signRefreshJwt(newUser);

  return res.json({
    message: "Signup successful",
    user: newUser,
    accessToken,
    refreshToken,
  });
});

authRouter.post("/refresh", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  let decoded: null | schema.User = null;

  try {
    decoded = jwtInstance.verifyRefreshJwt(token) as schema.User;
  } catch (error) {
    let message = "Invalid token";
    // if (error instanceof jwtInstance.TokenExpiredError) {
    //   message = "Token expired";
    // }
    return res.status(401).json({ message });
  }

  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      createdAt: schema.users.createdAt,
      updatedAt: schema.users.updatedAt,
    })
    .from(schema.users)
    .where(sql.eq(schema.users.id, decoded.id))
    .limit(1);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const accessToken = jwtInstance.signAccessJwt(user);
  const refreshToken = jwtInstance.signRefreshJwt(user);

  res.json({ message: "Token refreshed", accessToken, refreshToken, user });
});

authRouter.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  let decoded: null | schema.User = null;

  try {
    decoded = jwtInstance.verifyAccessJwt(token) as schema.User;
  } catch (error) {
    let message = "Invalid token";

    // if (error instanceof jwtInstance.TokenExpiredError) {
    //   message = "Token expired";
    // }
    return res.status(401).json({ message });
  }

  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      createdAt: schema.users.createdAt,
      updatedAt: schema.users.updatedAt,
    })
    .from(schema.users)
    .where(sql.eq(schema.users.id, decoded.id))
    .limit(1);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User profile", user });
});
