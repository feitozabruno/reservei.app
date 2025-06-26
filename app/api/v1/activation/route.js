import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import activation from "models/activation.js";
import {
  parseRequestBody,
  validator,
  CheckTokenSchema,
} from "models/validator.js";
import session from "models/session.js";

async function postHandler(request) {
  const inscureToken = await parseRequestBody(request);
  const secureToken = validator(inscureToken, CheckTokenSchema);

  const verifiedUser =
    await activation.consumeEmailVerificationToken(secureToken);

  const newSession = await session.create(verifiedUser.id);

  const response = NextResponse.json(
    {
      message: "Email verificado com sucesso.",
      user: {
        id: verifiedUser.id,
        username: verifiedUser.username,
        verified: true,
      },
    },
    { status: 200 },
  );

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
