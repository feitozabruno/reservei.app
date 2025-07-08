import { controller } from "infra/controller.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { NextResponse } from "next/server";
import upload from "models/upload.js";
import { UnauthorizedError, ValidationError } from "infra/errors.js";

async function postHandler(request) {
  const userId = request.user.id;

  if (!userId) {
    throw new UnauthorizedError({
      message: "Usuário não autenticado.",
      action: "Por favor, faça login para enviar uma imagem.",
    });
  }

  const imageBuffer = Buffer.from(await request.arrayBuffer());

  if (!imageBuffer || imageBuffer.length === 0) {
    throw new ValidationError({
      message: "Nenhuma imagem foi enviada.",
      action: "Por favor, envie uma imagem válida.",
    });
  }

  const blob = await upload.profilePhoto(userId, imageBuffer);

  return NextResponse.json(blob);
}

export const POST = controller(authenticate(postHandler));
