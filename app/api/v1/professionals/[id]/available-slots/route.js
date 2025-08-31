import { NextResponse } from "next/server";
import { controller } from "infra/controller.js";
import appointment from "models/appointment.js";

async function getHandler(request, { params }) {
  const { id } = await params;
  const date = request.nextUrl.searchParams.get("date");

  const availableSlots = await appointment.getAvailableSlots({
    professionalProfileId: id,
    targetDate: date,
  });

  return NextResponse.json(availableSlots, { status: 200 });
}

export const GET = controller(getHandler);
