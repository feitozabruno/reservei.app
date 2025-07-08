import { NextResponse } from "next/server";
import professional from "models/professional.js";
import { controller } from "infra/controller.js";
import {
  parseRequestBody,
  validator,
  CreateProfessionalSchema,
  UpdateProfessionalSchema,
} from "models/validator.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { ValidationError } from "infra/errors.js";
import { authorize } from "infra/middlewares/authorize.js";

async function postHandler(request) {
  const userInputValues = await parseRequestBody(request);
  userInputValues.userId = request.user.id;

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

  const sanitizedUserInputValues = validator(
    userInputValues,
    CreateProfessionalSchema,
  );

  const newProfessional = await professional.create(sanitizedUserInputValues);

  return NextResponse.json(newProfessional, { status: 201 });
}

async function patchHandler(request) {
  const userInputValues = await parseRequestBody(request);

  const sanitizedUserInputValues = validator(
    userInputValues,
    UpdateProfessionalSchema,
  );

  const updatedProfessional = await professional.update(
    request.user.id,
    sanitizedUserInputValues,
  );

  return NextResponse.json(updatedProfessional, { status: 200 });
}

export const POST = controller(authenticate(postHandler));

export const PATCH = controller(
  authenticate(authorize(["PROFESSIONAL"])(patchHandler)),
);
