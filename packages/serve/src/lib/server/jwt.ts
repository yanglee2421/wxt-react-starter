import z from "zod";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./error";

type JwtConstructorOptions = {
  accessTokenSecret?: string;
  refreshTokenSecret?: string;
  accessExpiresIn?: jwt.SignOptions["expiresIn"];
  refreshExpiresIn?: jwt.SignOptions["expiresIn"];
  algorithm?: jwt.Algorithm;
};

type RefreshPayload = z.infer<typeof JWTHelper.refreshPayloadSchema>;
type AccessPayload = z.infer<typeof JWTHelper.accessPayloadSchema>;

export class JWTHelper {
  static refreshPayloadSchema = z.object({
    userId: z.number(),
    sessionId: z.number(),
  });

  static accessPayloadSchema = z.looseObject({
    userId: z.number(),
  });

  #ACCESS_TOKEN_SECRET: string;
  #REFRESH_TOKEN_SECRET: string;
  #accessExpiresIn: jwt.SignOptions["expiresIn"];
  #refreshExpiresIn: jwt.SignOptions["expiresIn"];
  #algorithm: jwt.Algorithm;

  constructor({
    accessTokenSecret = "default_access_token_secret",
    refreshTokenSecret = "default_refresh_token_secret",
    accessExpiresIn = "15m",
    refreshExpiresIn = "7d",
    algorithm = "HS256",
  }: JwtConstructorOptions = {}) {
    this.#ACCESS_TOKEN_SECRET = accessTokenSecret;
    this.#REFRESH_TOKEN_SECRET = refreshTokenSecret;
    this.#accessExpiresIn = accessExpiresIn;
    this.#refreshExpiresIn = refreshExpiresIn;
    this.#algorithm = algorithm;
  }

  signAccessJwt(payload: AccessPayload) {
    return jwt.sign(payload, this.#ACCESS_TOKEN_SECRET, {
      expiresIn: this.#accessExpiresIn,
      algorithm: this.#algorithm,
    });
  }
  signRefreshJwt(payload: RefreshPayload) {
    return jwt.sign(payload, this.#REFRESH_TOKEN_SECRET, {
      expiresIn: this.#refreshExpiresIn,
      algorithm: this.#algorithm,
    });
  }
  verifyAccessJwt(token: string) {
    const payload = jwt.verify(
      token,
      this.#ACCESS_TOKEN_SECRET,
      this.getVerifyOptions(),
    );

    return JWTHelper.accessPayloadSchema.parse(payload);
  }
  verifyRefreshJwt(token: string) {
    const payload = jwt.verify(
      token,
      this.#REFRESH_TOKEN_SECRET,
      this.getVerifyOptions(),
    );

    return JWTHelper.refreshPayloadSchema.parse(payload);
  }

  // Shared Logic
  getSignOptions() {
    return {
      expiresIn: this.#refreshExpiresIn,
      algorithm: this.#algorithm,
    } satisfies jwt.SignOptions;
  }
  getVerifyOptions() {
    return {
      algorithms: [this.#algorithm],
      complete: false,
    } satisfies jwt.VerifyOptions;
  }
  decode(token: string) {
    const payload = jwt.decode(token);

    return JWTHelper.accessPayloadSchema.parse(payload);
  }

  // Error Handling
  static isExpiredError(error: unknown) {
    return error instanceof jwt.TokenExpiredError;
  }
  static isJsonWebTokenError(error: unknown) {
    return error instanceof jwt.JsonWebTokenError;
  }
  static isNotBeforeError(error: unknown) {
    return error instanceof jwt.NotBeforeError;
  }

  // Utility
  authorizationHeaderToToken(header?: string) {
    if (!header) {
      throw new UnauthorizedError("Authorization header missing");
    }

    const [schema, token] = header.split(" ");

    if (schema !== "Bearer") {
      throw new UnauthorizedError("Invalid authorization header format");
    }

    if (!token) {
      throw new UnauthorizedError("Token missing in authorization header");
    }

    return token;
  }
}
