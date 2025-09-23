import { NextResponse } from "next/server";
import professional from "models/professional.js";
import { controller } from "infra/controller.js";
import {
  parseRequestBody,
  validator,
  CreateProfessionalSchema,
} from "models/validator.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { UnauthorizedError, ValidationError } from "infra/errors.js";

async function postHandler(request) {
  const userId = request.user.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const userInputValues = await parseRequestBody(request);
  userInputValues.userId = userId;

  if (!request.user.email_verified_at) {
    throw new ValidationError({
      message: "Seu e-mail ainda não foi verificado.",
      action: "Verifique seu e-mail para continuar.",
    });
  }

  if (request.user.role) {
    throw new ValidationError({
      message: "Você já possui um perfil de profissional ou cliente.",
      action: "Entre em contato com o suporte para mais informações.",
    });
  }

  // const sanitizedUserInputValues = validator(
  //   userInputValues,
  //   CreateProfessionalSchema,
  // );

  const sanitizedUserInputValues = userInputValues; // --- IGNORE ---

  const newProfessional = await professional.create(sanitizedUserInputValues);

  return NextResponse.json(newProfessional, { status: 201 });
}

export const POST = controller(authenticate(postHandler));
