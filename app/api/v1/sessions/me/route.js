import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import session from "models/session.js";
import professional from "models/professional.js";
import { controller } from "infra/controller.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { UnauthorizedError } from "infra/errors.js";

async function getHandler() {
  const cookie = await cookies();
  const sessionId = cookie.get("session_id")?.value;

  if (!sessionId) {
    throw new UnauthorizedError();
  }

  try {
    const userId = await session.validate(sessionId);

    if (!userId) {
      throw new UnauthorizedError({
        message: "Sessão inválida/expirada ou usuário não encontrado",
        action: "Faça login novamente",
      });
    }

    const user = await professional.findOneById(userId);

    if (!user) {
      throw new UnauthorizedError({
        message: "Usuário ou Perfil não encontrado",
        action: "Faça login novamente",
      });
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    throw error;
  }
}

export const GET = controller(authenticate(getHandler));
