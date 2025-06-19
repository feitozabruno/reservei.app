import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import token from "models/token.js";

async function getHandler(request) {
  const getTokenParams = request.nextUrl.searchParams.get("token");
  const verifiedUser =
    await token.consumeEmailVerificationToken(getTokenParams);

  return NextResponse.json(
    {
      message: "Email verificado com sucesso.",
      user: {
        id: verifiedUser.id,
        username: verifiedUser.username,
        email: verifiedUser.email,
        verified: true,
      },
    },
    { status: 200 },
  );
}

export const GET = controller(getHandler);
