import { NextResponse } from "next/server";
import professional from "models/professional.js";
import { controller } from "infra/controller";

async function getHandler(request, { params }) {
  const { username } = await params;
  const professionalProfile = await professional.findOneByUsername(username);

  if (!professionalProfile)
    return NextResponse.json(
      { error: "Profissional não encontrado" },
      { status: 404 },
    );

  return NextResponse.json(professionalProfile);
}

export const GET = controller(getHandler);
