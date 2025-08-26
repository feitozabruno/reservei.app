import database from "infra/database.js";
import { ValidationError, ForbiddenError } from "infra/errors.js";

async function create({ professionalId, dayOfWeek, startTime, endTime }) {
  const existingOverlapsResult = await database.query({
    text: `
      SELECT 1 FROM availabilities
      WHERE
        professional_id = $1
      AND
        day_of_week = $2
      AND
        (start_time, end_time) OVERLAPS ($3::time, $4::time)
      LIMIT 1;
    `,
    values: [professionalId, dayOfWeek, startTime, endTime],
  });

  if (existingOverlapsResult.rowCount > 0) {
    throw new ValidationError({
      message: "O horário fornecido se sobrepõe a um horário já cadastrado.",
      action: "Ajuste os horários para que não haja conflitos.",
    });
  }

  const result = await database.query({
    text: `
      INSERT INTO availabilities
        (professional_id, day_of_week, start_time, end_time)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *;
    `,
    values: [professionalId, dayOfWeek, startTime, endTime],
  });

  return result.rows[0];
}

async function findByProfessionalId(professionalId) {
  const result = await database.query({
    text: `
      SELECT
        *
      FROM
        availabilities
      WHERE
        professional_id = $1
      ORDER BY
        day_of_week, start_time;
    `,
    values: [professionalId],
  });

  return result.rows;
}

async function deleteById({ availabilityId, professionalId }) {
  const result = await database.query({
    text: `
      DELETE FROM
        availabilities
      WHERE
        id = $1
      AND
        professional_id = $2
      RETURNING id;
    `,
    values: [availabilityId, professionalId],
  });

  if (result.rowCount === 0) {
    throw new ForbiddenError({
      message: "Regra de horário não encontrada ou não pertence a você.",
    });
  }
}

export default {
  create,
  findByProfessionalId,
  deleteById,
};
