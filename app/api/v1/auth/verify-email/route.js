import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import authentication from "models/authentication.js";

async function getHandler(request) {
  const token = request.nextUrl.searchParams.get("token");
  const verifiedUser = await authentication.verifyEmailToken(token);

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
