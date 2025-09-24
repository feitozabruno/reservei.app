import database from "infra/database.js";
import { NotFoundError, ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  console.log(userInputValues);
  await validateUniqueUsername(userInputValues.username);

  const newProfessional = await runInsertQuery(userInputValues);

  await runUpdateQuery(userInputValues.userId);

  return newProfessional;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          professional_profiles
          (
            user_id,
            username,
            full_name,
            specialty,
            phone_number,
            business_name,
            bio,
            appointment_duration_minutes,
            timezone,
            address_cep,
            address_street,
            address_number,
            address_neighborhood,
            address_city,
            address_state,
            address_complement
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING
          *
      ;`,
      values: [
        userInputValues.userId,
        userInputValues.username,
        userInputValues.fullName,
        userInputValues.specialty,
        userInputValues.phoneNumber,
        userInputValues.businessName || null,
        userInputValues.bio || null,
        userInputValues.appointmentDuration || 30,
        userInputValues.timezone,
        userInputValues.address.cep,
        userInputValues.address.street,
        userInputValues.address.number,
        userInputValues.address.neighborhood,
        userInputValues.address.city,
        userInputValues.address.state,
        userInputValues.address.complement || null,
      ],
    });

    return results.rows[0];
  }

  async function runUpdateQuery(professionalId) {
    await database.query({
      text: `
        UPDATE
          users
        SET
          role = 'PROFESSIONAL',
          updated_at = NOW()
        WHERE
          id = $1
      ;`,
      values: [professionalId],
    });
  }
}

async function update(professionalId, userInputValues) {
  await findOneById(professionalId);

  if (userInputValues.username) {
    await validateUniqueUsername(userInputValues.username);
  }

  const updatedProfessional = await runUpdateQuery(userInputValues);
  return updatedProfessional;

  async function runUpdateQuery(userInputValues) {
    const results = await database.query({
      text: `
        UPDATE
          professional_profiles
        SET
          username = COALESCE($1, username),
          full_name = COALESCE($2, full_name),
          phone_number = COALESCE($3, phone_number),
          business_name = COALESCE($4, business_name),
          bio = COALESCE($5, bio),
          specialty = COALESCE($6, specialty),
          profile_photo_url = COALESCE($7, profile_photo_url),
          cover_picture_url = COALESCE($8, cover_picture_url),
          updated_at = NOW()
        WHERE
          id = $9
        RETURNING
          *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.fullName,
        userInputValues.phoneNumber,
        userInputValues.businessName,
        userInputValues.bio,
        userInputValues.specialty,
        userInputValues.profilePhotoUrl,
        userInputValues.coverPictureUrl,
        professionalId,
      ],
    });

    return results.rows[0];
  }
}

async function findOneById(id) {
  const userFound = await runSelectQuery(id);
  return userFound;

  async function runSelectQuery(id) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          professional_profiles
        WHERE
          id = $1 OR user_id = $1
        LIMIT
          1
      ;`,
      values: [id],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O profissional informado não foi encontrado no sistema.",
        action: "Verifique se o ID do usuário está correto.",
      });
    }

    return results.rows[0];
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          professional_profiles
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
        ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
      SELECT
        username
      FROM
        professional_profiles
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O nome de usuário já está sendo utilizado.",
      action: "Utilize outro nome de usuário para realizar essa operação.",
    });
  }
}

const professional = {
  create,
  update,
  findOneById,
  findOneByUsername,
};

export default professional;
