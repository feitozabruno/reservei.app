import appointment from "models/appointment.js";
import { ForbiddenError, NotFoundError } from "infra/errors.js";
import { controller } from "infra/controller.js";
import { authenticate } from "infra/middlewares/authenticate.js";
import { authorize } from "infra/middlewares/authorize.js";

async function deleteHandler(request, { params }) {
  const user = request.user;
  const { id: appointmentId } = await params;

  const existingAppointment = await appointment.findOneById(appointmentId);

  if (!existingAppointment) {
    throw new NotFoundError({
      message: `Agendamento com o ID "${appointmentId}" não encontrado.`,
    });
  }

  const isClient = existingAppointment.client_id === user.id;
  const isProfessional = existingAppointment.professional_id === user.id;

  if (!isClient && !isProfessional) {
    throw new ForbiddenError({
      message: "Você não tem permissão para cancelar este agendamento.",
    });
  }

  await appointment.deleteOneById(appointmentId);

  return new Response(null, { status: 204 });
}

export const DELETE = controller(
  authenticate(authorize(["CLIENT", "PROFESSIONAL"])(deleteHandler)),
);
