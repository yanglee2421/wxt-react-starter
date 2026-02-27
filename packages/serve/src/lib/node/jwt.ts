import jwt from "jsonwebtoken";

type JwtConstructorOptions = {
  accessTokenSecret?: string;
  refreshTokenSecret?: string;
  accessExpiresIn?: jwt.SignOptions["expiresIn"];
  refreshExpiresIn?: jwt.SignOptions["expiresIn"];
  algorithm?: jwt.Algorithm;
};

class Jwt {
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

  signAccessJwt(payload: object) {
    return jwt.sign(payload, this.#ACCESS_TOKEN_SECRET, {
      expiresIn: this.#accessExpiresIn,
      algorithm: this.#algorithm,
    });
  }
  signRefreshJwt(payload: object) {
    return jwt.sign(payload, this.#REFRESH_TOKEN_SECRET, {
      expiresIn: this.#refreshExpiresIn,
      algorithm: this.#algorithm,
    });
  }
  verifyAccessJwt(token: string) {
    return jwt.verify(
      token,
      this.#ACCESS_TOKEN_SECRET,
      this.getAccessVerifyOptions(),
    );
  }
  verifyRefreshJwt(token: string) {
    return jwt.verify(
      token,
      this.#REFRESH_TOKEN_SECRET,
      this.getRefreshVerifyOptions(),
    );
  }
  getAccessSignOptions(): jwt.SignOptions {
    return {
      expiresIn: this.#accessExpiresIn,
      algorithm: this.#algorithm,
    };
  }
  getRefreshSignOptions(): jwt.SignOptions {
    return {
      expiresIn: this.#refreshExpiresIn,
      algorithm: this.#algorithm,
    };
  }
  getAccessVerifyOptions(): jwt.VerifyOptions {
    return {
      algorithms: [this.#algorithm],
    };
  }
  getRefreshVerifyOptions(): jwt.VerifyOptions {
    return {
      algorithms: [this.#algorithm],
    };
  }
  decodeJwt(token: string) {
    return jwt.decode(token);
  }
}

export const jwtInstance = new Jwt();
