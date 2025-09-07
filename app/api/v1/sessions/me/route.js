/* global Promise */
import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import professional from "models/professional.js";
import client from "models/client.js";

async function getHandler(request) {
  const userId = request.user.id;

  try {
    const [professionalFound, clientFound] = await Promise.all([
      professional.findOneById(userId).catch(() => null),
      client.findOneById(userId).catch(() => null),
    ]);

    if (!professionalFound && !clientFound) {
      const baseUserWithProfileStatus = {
        ...request.user,
        profile_status: "incomplete",
      };
      return NextResponse.json(baseUserWithProfileStatus, { status: 200 });
    }

    const userDetails = professionalFound || clientFound;

    return NextResponse.json(userDetails, {
      status: 200,
    });
  } catch (err) {
    console.error("Erro inesperado ao buscar perfil do usuário:", err);
    throw err;
  }
}

export const GET = controller(authenticate(getHandler));
