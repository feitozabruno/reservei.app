import { controller } from "infra/controller.js";
import authentication from "models/authentication.js";
import session from "models/session.js";
import { NextResponse } from "next/server";

async function postHandler(request) {
  const userInputValues = await request.json();

  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  const response = NextResponse.json(newSession, { status: 201 });

  response.cookies.set({
    name: "session_id",
    value: newSession.token,
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  return response;
}

export const POST = controller(postHandler);
