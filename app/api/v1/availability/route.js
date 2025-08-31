import { NextResponse } from "next/server";
import {
  parseRequestBody,
  validator,
  CreateAvailabilitySchema,
} from "models/validator.js";
import professional from "models/professional.js";
import availability from "models/availability.js";
import { controller } from "infra/controller.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { authorize } from "infra/middlewares/authorize.js";
import { ForbiddenError, ValidationError } from "infra/errors.js";

async function postHandler(request) {
  const userId = request.user.id;
  const body = await parseRequestBody(request);

  const { dayOfWeek, startTime, endTime } = validator(
    body,
    CreateAvailabilitySchema,
  );

  const professionalProfile = await professional.findOneById(userId);

  const newAvailability = await availability.create({
    professionalId: professionalProfile.id,
    dayOfWeek,
    startTime,
    endTime,
  });

  return NextResponse.json(newAvailability, { status: 201 });
}

async function getHandler(request) {
  const userId = request.user.id;
  const professionalProfile = await professional.findOneById(userId);
  const availabilities = await availability.findByProfessionalId(
    professionalProfile.id,
  );

  return NextResponse.json(availabilities, { status: 200 });
}

async function deleteHandler(request) {
  const userId = request.user.id;
  const availabilityId = request.nextUrl.searchParams.get("id");

  if (!availabilityId) {
    throw new ValidationError({
      message: "O 'id' da regra de horário é obrigatório.",
      action: "Forneça o 'id' como um query parameter.",
    });
  }

  const professionalProfile = await professional.findOneById(userId);
  if (!professionalProfile) {
    throw new ForbiddenError({
      message: "Apenas profissionais podem deletar regras de horário.",
    });
  }

  await availability.deleteById({
    availabilityId,
    professionalId: professionalProfile.id,
  });

  return NextResponse.json(
    {
      message: "Regra de horário deletada com sucesso.",
    },
    { status: 200 },
  );
}

export const POST = controller(
  authenticate(authorize(["PROFESSIONAL"])(postHandler)),
);

export const GET = controller(
  authenticate(authorize(["PROFESSIONAL"])(getHandler)),
);

export const DELETE = controller(
  authenticate(authorize(["PROFESSIONAL"])(deleteHandler)),
);
