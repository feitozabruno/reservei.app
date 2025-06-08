import { NextResponse } from "next/server";

export function controller(handler) {
  return async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: error.message || "Erro interno" },
        {
          status: 500,
        },
      );
    }
  };
}
