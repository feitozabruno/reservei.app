import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { authorize } from "infra/middlewares/authorize.js";
import professional from "models/professional.js";
import upload from "models/upload.js";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "infra/errors.js";
import {
  parseMultipartFormData,
  parseRequestBody,
  UpdateProfessionalSchema,
  validator,
} from "models/validator.js";

async function getHandler(request, { params }) {
  const { id: professionalId } = await params;
  if (!professionalId) {
    throw new UnauthorizedError();
  }

  const existingProfessional = await professional.findOneById(professionalId);
  if (!existingProfessional) {
    throw new NotFoundError({
      message: "Profissional não encontrado.",
      action: "Verifique se o profissional existe.",
    });
  }

  return NextResponse.json(existingProfessional);
}

async function patchHandler(request, { params }) {
  const userId = request.user.id;
  const { id: professionalId } = await params;
  if (!professionalId) {
    throw new UnauthorizedError();
  }

  const existingProfessional = await professional.findOneById(professionalId);
  if (!existingProfessional) {
    throw new NotFoundError({
      message: "Profissional não encontrado.",
      action: "Verifique se o profissional existe.",
    });
  }

  const contentType = request.headers.get("content-type") || "";

  let userInputValues;

  if (contentType.includes("application/json")) {
    userInputValues = await parseRequestBody(request);
    delete userInputValues.profilePhotoUrl;
    delete userInputValues.coverPictureUrl;
    delete userInputValues.profileImage;
    delete userInputValues.coverImage;
  } else if (contentType.includes("multipart/form-data")) {
    const { jsonData, files } = await parseMultipartFormData(request, {
      jsonKey: "json",
      fileKeys: ["profilePhoto", "coverPicture"],
    });

    userInputValues = jsonData || {};

    const profilePhotoFile = files.profilePhoto;
    const coverPictureFile = files.coverPicture;

    if (profilePhotoFile) {
      const profilePhotoBuffer = Buffer.from(
        await profilePhotoFile.arrayBuffer(),
      );
      const profilePhotoBlob = await upload.image(
        userId ?? professionalId,
        profilePhotoBuffer,
      );
      userInputValues.profilePhotoUrl = profilePhotoBlob.url;
    }

    if (coverPictureFile) {
      const coverPictureBuffer = Buffer.from(
        await coverPictureFile.arrayBuffer(),
      );
      const coverPictureBlob = await upload.image(
        userId ?? professionalId,
        coverPictureBuffer,
      );
      userInputValues.coverPictureUrl = coverPictureBlob.url;
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
    UpdateProfessionalSchema,
  );

  const updatedProfessional = await professional.update(
    professionalId,
    sanitizedUserInputValues,
  );

  return NextResponse.json(updatedProfessional, { status: 200 });
}

export const GET = controller(authenticate(getHandler));

export const PATCH = controller(
  authenticate(authorize(["PROFESSIONAL"])(patchHandler)),
);
