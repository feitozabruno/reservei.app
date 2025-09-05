import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import appointment from "models/appointment.js";

async function getHandler(request, { params }) {
  const { id } = await params;
  const date = request.nextUrl.searchParams.get("date");

  const appointments = await appointment.getByDate({
    professionalProfileId: id,
    targetDate: date,
  });

  return NextResponse.json(appointments, { status: 200 });
}

export const GET = controller(getHandler);
