import { NextResponse } from "next/server";
import session from "models/session.js";
import { UnauthorizedError } from "infra/errors.js";
import { controller } from "infra/controller.js";

async function getHandler(request) {
  const sessionId = request.cookies.get("session_id")?.value;

  if (!sessionId) {
    throw new UnauthorizedError({
      message: "ID da sessão não encontrado",
      action: "Faça login novamente.",
    });
  }

  const userId = await session.validate(sessionId);

  if (!userId) {
    throw new UnauthorizedError({
      message: "Sessão inválida ou expirada",
      action: "Faça login novamente.",
    });
  }

  return NextResponse.json({ user_id: userId });
}

export const GET = controller(getHandler);
