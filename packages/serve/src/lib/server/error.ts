import { mapGroupBy } from "@yotulee/run";
import z from "zod";
import { JWTHelper } from "./jwt";

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized", statusCode: number = 401) {
    super(message, statusCode);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Not Found", statusCode: number = 404) {
    super(message, statusCode);
  }
}

export class ErrorHelper {
  static calculateErrorMessage(
    error: unknown,
    defaultMessage: string = "An error occurred",
  ) {
    if (JWTHelper.isExpiredError(error)) {
      return "ACCESS_TOKEN_EXPIRED";
    }

    if (error instanceof z.ZodError) {
      return JSON.stringify(
        Object.fromEntries(
          Array.from(
            mapGroupBy(error.issues, (issue) => issue.path.join(".")),
            ([key, issuses]) => [
              key,
              issuses.map((issue) => issue.message).join(", "),
            ],
          ),
        ),
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return defaultMessage;
  }

  static calculateErrorStatusCode(
    error: unknown,
    defaultStatusCode: number = 500,
  ) {
    if (JWTHelper.isExpiredError(error)) {
      return 401;
    }

    if (JWTHelper.isNotBeforeError(error)) {
      return 401;
    }

    if (JWTHelper.isJsonWebTokenError(error)) {
      return 401;
    }

    if (ErrorHelper.isHttpError(error)) {
      return error.statusCode;
    }

    if (error instanceof z.ZodError) {
      return 422;
    }

    if (!ErrorHelper.isError(error)) {
      return defaultStatusCode;
    }

    if (typeof error.cause === "number") {
      return error.cause;
    }

    return defaultStatusCode;
  }

  static isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
  }

  static isError(error: unknown): error is Error {
    return error instanceof Error;
  }
}
