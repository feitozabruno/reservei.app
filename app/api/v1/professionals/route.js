import { NextResponse } from "next/server";
import professional from "models/professional.js";
import { controller } from "infra/controller.js";
import {
  parseRequestBody,
  validator,
  CreateProfessionalSchema,
  parseMultipartFormData,
} from "models/validator.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { UnauthorizedError, ValidationError } from "infra/errors.js";
import upload from "models/upload";

async function postHandler(request) {
  const userId = request.user.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const contentType = request.headers.get("content-type") || "";
  let userInputValues;
  let files = {};

  if (contentType.includes("application/json")) {
    userInputValues = await parseRequestBody(request);
  } else if (contentType.includes("multipart/form-data")) {
    const parsedData = await parseMultipartFormData(request, {
      jsonKey: "json",
      fileKeys: ["profilePhoto", "coverPicture"],
    });
    userInputValues = parsedData.jsonData || {};
    files = parsedData.files;
  } else {
    throw new ValidationError({
      message: "Content-Type não suportado.",
    });
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

  const profilePhotoFile = files.profilePhoto;
  const coverPictureFile = files.coverPicture;

  if (profilePhotoFile) {
    const profilePhotoBuffer = Buffer.from(
      await profilePhotoFile.arrayBuffer(),
    );
    const profilePhotoBlob = await upload.image(userId, profilePhotoBuffer);
    userInputValues.profilePhotoUrl = profilePhotoBlob.url;
  }

  if (coverPictureFile) {
    const coverPictureBuffer = Buffer.from(
      await coverPictureFile.arrayBuffer(),
    );
    const coverPictureBlob = await upload.image(userId, coverPictureBuffer);
    userInputValues.coverPictureUrl = coverPictureBlob.url;
  }

  const sanitizedUserInputValues = validator(
    userInputValues,
    CreateProfessionalSchema,
  );

  const newProfessional = await professional.create(sanitizedUserInputValues);

  return NextResponse.json(newProfessional, { status: 201 });
}

export const POST = controller(authenticate(postHandler));
