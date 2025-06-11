import { NextResponse } from "next/server";
import user from "models/user.js";
import { controller } from "infra/controller.js";

async function postHandler(request) {
  const userInputValues = await request.json();
  const newUser = await user.create(userInputValues);
  return NextResponse.json(newUser, { status: 201 });
}

export const POST = controller(postHandler);
