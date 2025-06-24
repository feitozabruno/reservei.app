import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import activation from "models/activation.js";
import {
  parseRequestBody,
  validator,
  VerificationTokenSchema,
} from "models/validator.js";

async function postHandler(request) {
  const inscureToken = await parseRequestBody(request);
  const secureToken = validator(inscureToken, VerificationTokenSchema);

  const verifiedUser =
    await activation.consumeEmailVerificationToken(secureToken);

  return NextResponse.json(
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
}

export const POST = controller(postHandler);
