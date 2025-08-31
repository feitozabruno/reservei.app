import database from "infra/database.js";
import { addMinutes, isBefore, startOfDay, endOfDay, format } from "date-fns";
import { toDate, toZonedTime } from "date-fns-tz";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function getAvailableSlots({ professionalProfileId, targetDate }) {
  const professionalResult = await database.query({
    text: `
      SELECT
        appointment_duration_minutes, timezone
      FROM
        professional_profiles
      WHERE
        id = $1
    ;`,
    values: [professionalProfileId],
  });

  if (professionalResult.rowCount === 0) {
    throw new NotFoundError({ message: "Perfil profissional não encontrado." });
  }

  const professional = professionalResult.rows[0];
  if (!professional.appointment_duration_minutes || !professional.timezone) {
    // Retorna vazio se o profissional não tiver as configurações essenciais.
    return [];
  }

  const { appointment_duration_minutes: appointmentDuration, timezone } =
    professional;

  // Interpreta a data de entrada (ex: '2025-09-27') no fuso horário do profissional
  const targetDayInProfessionalTz = toDate(targetDate, { timeZone: timezone });

  // Calcula o intervalo exato do dia (00:00:00 a 23:59:59) no fuso horário do profissional.
  const startOfLocalDay = startOfDay(targetDayInProfessionalTz);
  const endOfLocalDay = endOfDay(targetDayInProfessionalTz);
  const targetDayOfWeek = targetDayInProfessionalTz.getDay(); // 0=Domingo, 1=Segunda...

  // Busca as regras de disponibilidade e os agendamentos já marcados em paralelo.
  const [availabilityRulesResult, bookedAppointmentsResult] = await Promise.all(
    [
      database.query({
        text: `
          SELECT
            start_time, end_time
          FROM
            availabilities
          WHERE
            professional_id = $1
          AND
            day_of_week = $2
        ;`,
        values: [professionalProfileId, targetDayOfWeek],
      }),

      database.query({
        text: `
          SELECT
            start_time
          FROM
            appointments
          WHERE
            professional_id = $1
          AND
            status IN ('PENDING', 'SCHEDULED')
          AND
            start_time >= $2
          AND
            start_time <= $3
        ;`,
        values: [professionalProfileId, startOfLocalDay, endOfLocalDay],
      }),
    ],
  );

  const availabilityRules = availabilityRulesResult.rows;
  const bookedAppointments = bookedAppointmentsResult.rows;

  // Gera todos os "slots" potenciais dentro dos blocos de trabalho definidos.
  const potentialSlots = [];
  for (const rule of availabilityRules) {
    const startTimeString = `${targetDate}T${rule.start_time}`;
    const endTimeString = `${targetDate}T${rule.end_time}`;

    let slotTime = toDate(startTimeString, { timeZone: timezone });
    const availabilityEndTime = toDate(endTimeString, { timeZone: timezone });

    while (true) {
      const slotEndTime = addMinutes(slotTime, appointmentDuration);

      // Se o fim do slot atual passar do fim do expediente, paramos.
      if (isBefore(availabilityEndTime, slotEndTime)) {
        break;
      }

      potentialSlots.push(new Date(slotTime));
      slotTime = addMinutes(slotTime, appointmentDuration);
    }
  }

  // Filtra os slots potenciais.
  const bookedTimes = new Set(
    bookedAppointments.map((app) => new Date(app.start_time).getTime()),
  );

  const now = new Date();
  const availableSlots = potentialSlots
    .filter((slot) => !bookedTimes.has(slot.getTime())) // Remove slots já agendados
    .filter((slot) => isBefore(now, slot)); // Remove slots que já passaram

  // Ordena os slots e retorna no formato padrão UTC (ISO 8601).
  availableSlots.sort((slotA, slotB) => slotA.getTime() - slotB.getTime());
  return availableSlots.map((slot) => slot.toISOString());
}

async function create({ clientProfileId, professionalProfileId, startTime }) {
  return database.withTransaction(async (client) => {
    const professionalResult = await client.query({
      text: `
        SELECT
          appointment_duration_minutes, timezone, auto_confirm_appointments
        FROM
          professional_profiles
        WHERE
          id = $1
        FOR UPDATE
      ;`,
      values: [professionalProfileId],
    });

    if (professionalResult.rowCount === 0) {
      throw new NotFoundError({
        message: "Perfil profissional não encontrado.",
      });
    }
    const professional = professionalResult.rows[0];
    const {
      appointment_duration_minutes,
      timezone,
      auto_confirm_appointments,
    } = professional;

    // Converte o startTime (UTC) para o fuso do profissional para pegar a data correta
    const startTimeDate = new Date(startTime);
    const zonedStartTime = toZonedTime(startTimeDate, timezone);
    const targetDate = format(zonedStartTime, "yyyy-MM-dd");

    // Revalida a disponibilidade DENTRO da transação segura
    const validSlots = await getAvailableSlots({
      professionalProfileId,
      targetDate,
    });

    if (!validSlots.includes(startTime)) {
      throw new ValidationError({
        message:
          "O horário solicitado não é um slot de agendamento válido ou já foi reservado.",
        action: "Por favor, selecione outro horário na agenda.",
      });
    }

    const endTimeDate = addMinutes(startTimeDate, appointment_duration_minutes);

    const initialStatus = auto_confirm_appointments ? "SCHEDULED" : "PENDING";

    const insertResult = await client.query({
      text: `
        INSERT INTO
          appointments
          (client_id, professional_id, start_time, end_time, status)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING *
      ;`,
      values: [
        clientProfileId,
        professionalProfileId,
        startTimeDate.toISOString(),
        endTimeDate.toISOString(),
        initialStatus,
      ],
    });

    await client.query("COMMIT");
    return insertResult.rows[0];
  });
}

const appointment = {
  getAvailableSlots,
  create,
};

export default appointment;
