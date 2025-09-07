import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { authorize } from "infra/middlewares/authorize.js";
import client from "models/client.js";
import upload from "models/upload.js";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "infra/errors.js";
import {
  parseMultipartFormData,
  parseRequestBody,
  UpdateClientSchema,
  validator,
} from "models/validator.js";

async function getHandler(request, { params }) {
  const { id: userId } = await params;

  if (!userId) {
    throw new UnauthorizedError();
  }

  const existingClient = await client.findOneById(userId);

  if (!existingClient) {
    throw new NotFoundError({
      message: "Cliente não encontrado.",
      action: "Verifique se o cliente existe.",
    });
  }

  return NextResponse.json(existingClient);
}

async function patchHandler(request, { params }) {
  const { id: userId } = await params;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const existingClient = await client.findOneById(userId);
  if (!existingClient) {
    throw new NotFoundError({
      message: "Cliente não encontrado.",
      action: "Verifique se o cliente existe.",
    });
  }

  const contentType = request.headers.get("content-type") || "";

  let userInputValues = {};

  if (contentType.includes("application/json")) {
    userInputValues = await parseRequestBody(request);
  } else if (contentType.includes("multipart/form-data")) {
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
  } else {
    throw new ValidationError({
      message: "Content-Type não suportado.",
      action:
        "Envie a requisição como 'application/json' ou 'multipart/form-data'.",
    });
  }

  if (Object.keys(userInputValues).length === 0) {
    throw new ValidationError({
      message: "Nenhum dado para atualizar foi enviado.",
    });
  }

  const sanitizedUserInputValues = validator(
    userInputValues,
    UpdateClientSchema,
  );

  const updatedClient = await client.update(userId, sanitizedUserInputValues);

  return NextResponse.json(updatedClient, { status: 200 });
}

export const GET = controller(authenticate(getHandler));

export const PATCH = controller(
  authenticate(authorize(["CLIENT"])(patchHandler)),
);
