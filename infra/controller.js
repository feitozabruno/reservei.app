import {
  ServiceError,
  InternalServerError,
  ValidationError,
  NotFoundError,
  MethodNotAllowedError,
  UnauthorizedError,
} from "./errors.js";
import { NextResponse } from "next/server";

export function controller(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (
        error instanceof ServiceError ||
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof MethodNotAllowedError ||
        error instanceof UnauthorizedError
      ) {
        return NextResponse.json(error, {
          status: error.statusCode,
        });
      }

      const publicErrorObject = new InternalServerError({
        cause: error,
      });

      console.error(publicErrorObject);

      return NextResponse.json(publicErrorObject, {
        status: publicErrorObject.statusCode,
      });
    }
  };
}
