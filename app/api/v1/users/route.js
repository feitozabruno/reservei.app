import { NextResponse } from "next/server";
import user from "models/user.js";
import activation from "models/activation.js";
import { controller } from "infra/controller.js";
import {
  parseRequestBody,
  validator,
  CreateUserSchema,
} from "models/validator.js";

async function postHandler(request) {
  const userInputValues = await parseRequestBody(request);
  const sanitizedUserInputValues = validator(userInputValues, CreateUserSchema);
  const newUser = await user.create(sanitizedUserInputValues);
  await activation.createEmailVerificationToken(newUser);

  return NextResponse.json(newUser, { status: 201 });
}

export const POST = controller(postHandler);
