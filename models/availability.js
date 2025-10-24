import database from "infra/database.js";
import { ValidationError, ForbiddenError } from "infra/errors.js";

function checkForSelfOverlaps(availabilities) {
  for (let i = 0; i < availabilities.length; i++) {
    for (let j = i + 1; j < availabilities.length; j++) {
      const a = availabilities[i];
      const b = availabilities[j];

      if (
        a.dayOfWeek === b.dayOfWeek &&
        a.startTime < b.endTime &&
        a.endTime > b.startTime
      ) {
        throw new ValidationError({
          message: `Os horários [${a.startTime}-${a.endTime}] e [${b.startTime}-${b.endTime}] para o mesmo dia se sobrepõem na sua requisição.`,
          action:
            "Ajuste os horários enviados para que não haja conflitos internos.",
        });
      }
    }
  }
}

async function createManyInTransaction(availabilities) {
  if (!availabilities || availabilities.length === 0) {
    return [];
  }

  checkForSelfOverlaps(availabilities);

  const professionalId = availabilities[0].professionalId;
  const daysOfWeek = availabilities.map((a) => a.dayOfWeek);
  const startTimes = availabilities.map((a) => a.startTime);
  const endTimes = availabilities.map((a) => a.endTime);

  await database.query({
    text: `
      DELETE FROM
        availabilities
      WHERE
        professional_id = $1
    ;`,
    values: [professionalId],
  });

  return database.withTransaction(async (client) => {
    const query = {
      text: `
        WITH new_availabilities AS (
          SELECT
            UNNEST($2::int[]) AS day_of_week,
            UNNEST($3::time[]) AS start_time,
            UNNEST($4::time[]) AS end_time
        ),
        conflicts AS (
          SELECT 1
          FROM availabilities a
          JOIN new_availabilities n
            ON a.day_of_week = n.day_of_week
            AND (a.start_time, a.end_time) OVERLAPS (n.start_time, n.end_time)
          WHERE a.professional_id = $1
          LIMIT 1
        ),
        inserted AS (
          INSERT INTO availabilities (professional_id, day_of_week, start_time, end_time)
          SELECT $1, day_of_week, start_time, end_time
          FROM new_availabilities
          WHERE NOT EXISTS (SELECT 1 FROM conflicts)
          RETURNING *
        )
        SELECT
          (SELECT COUNT(*) > 0 FROM conflicts) AS has_conflict,
          (SELECT array_agg(to_json(inserted.*)) FROM inserted) AS inserted_rows
      ;`,
      values: [professionalId, daysOfWeek, startTimes, endTimes],
    };

    const result = await client.query(query);
    const { has_conflict, inserted_rows } = result.rows[0];

    if (has_conflict) {
      throw new ValidationError({
        message:
          "Um ou mais horários fornecidos se sobrepõem a horários já cadastrados.",
        action: "Ajuste os horários para que não haja conflitos.",
      });
    }

    return inserted_rows || [];
  });
}

async function create({ professionalId, dayOfWeek, startTime, endTime }) {
  const existingOverlapsResult = await database.query({
    text: `
      SELECT
        1
      FROM
        availabilities
      WHERE
        professional_id = $1
      AND
        day_of_week = $2
      AND
        (start_time, end_time)
      OVERLAPS
        ($3::time, $4::time)
      LIMIT 1
    ;`,
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
      INSERT INTO
        availabilities
        (professional_id, day_of_week, start_time, end_time)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
    ;`,
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
        day_of_week, start_time
    ;`,
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
      RETURNING id
    ;`,
    values: [availabilityId, professionalId],
  });

  if (result.rowCount === 0) {
    throw new ForbiddenError({
      message: "Regra de horário não encontrada ou não pertence a você.",
    });
  }
}

const availability = {
  createManyInTransaction,
  create,
  findByProfessionalId,
  deleteById,
};

export default availability;
