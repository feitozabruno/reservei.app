import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { authorize } from "infra/middlewares/authorize.js";
import {
  parseRequestBody,
  validator,
  CreateAppointmentSchema,
} from "models/validator.js";
import appointment from "models/appointment.js";

async function postHandler(request) {
  const userId = request.user.id;

  const body = await parseRequestBody(request);
  const { professionalProfileId, startTime } = validator(
    body,
    CreateAppointmentSchema,
  );

  const newAppointment = await appointment.create({
    clientProfileId: userId,
    professionalProfileId,
    startTime,
  });

  return NextResponse.json(newAppointment, { status: 201 });
}

export const POST = controller(
  authenticate(authorize(["CLIENT", "PROFESSIONAL"])(postHandler)),
);
