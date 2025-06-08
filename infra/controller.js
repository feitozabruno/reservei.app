import { ServiceError, InternalServerError } from "./errors.js";
import { NextResponse } from "next/server";

export function controller(handler) {
  return async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof ServiceError) {
        return NextResponse.json(error, {
          status: error.statusCode,
        });
      }

      const publicErrorObject = new InternalServerError({
        statusCode: error.statusCode,
        cause: error,
      });

      console.error(publicErrorObject);

      return NextResponse.json(publicErrorObject, {
        status: publicErrorObject.statusCode,
      });
    }
  };
}
