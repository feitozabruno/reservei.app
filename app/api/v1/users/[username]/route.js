import { NextResponse } from "next/server";
import user from "models/user.js";
import { controller } from "infra/controller.js";
import {
  parseRequestBody,
  validator,
  UpdateUserSchema,
} from "models/validator.js";

async function getHandler(_request, context) {
  const { username } = await context.params;
  const userFound = await user.findOneByUsername(username);

  return NextResponse.json(userFound, { status: 200 });
}

async function patchHandler(request, context) {
  const { username } = await context.params;
  const userInputValues = await parseRequestBody(request);
  const sanitizedUserInputValues = validator(userInputValues, UpdateUserSchema);
  const updatedUser = await user.update(username, sanitizedUserInputValues);

  return NextResponse.json(updatedUser, { status: 200 });
}

export const GET = controller(getHandler);
export const PATCH = controller(patchHandler);
