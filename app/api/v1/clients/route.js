import { NextResponse } from "next/server";
import client from "models/client.js";
import { controller } from "infra/controller.js";
import {
  parseMultipartFormData,
  validator,
  CreateClientSchema,
  parseRequestBody,
} from "models/validator.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { UnauthorizedError, ValidationError } from "infra/errors.js";
import upload from "models/upload.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function postHandler(request) {
  const userId = request.user.id;

  if (!userId) {
    throw new UnauthorizedError();
  }

  const contentType = request.headers.get("content-type") || "";

  let userInputValues = {};

  if (contentType.includes("application/json")) {
    userInputValues = await parseRequestBody(request);
  }

  if (contentType.includes("multipart/form-data")) {
    const { jsonData, files } = await parseMultipartFormData(request, {
      jsonKey: "json",
      fileKeys: ["profilePhoto"],
    });

    userInputValues = { ...jsonData };

    const profilePhotoFile = files.profilePhoto;

    if (profilePhotoFile) {
      const profilePhotoBuffer = Buffer.from(
        await profilePhotoFile.arrayBuffer(),
      );
      const profilePhotoBlob = await upload.image(userId, profilePhotoBuffer);
      userInputValues.profilePhotoUrl = profilePhotoBlob.url;
    }
  }

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

  const sanitizedUserInputValues = validator(
    userInputValues,
    CreateClientSchema,
  );

  const newClient = await client.create(sanitizedUserInputValues);

  return NextResponse.json(newClient, { status: 201 });
}

export const POST = controller(authenticate(postHandler));
