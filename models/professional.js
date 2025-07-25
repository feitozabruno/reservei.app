import database from "infra/database.js";
import { NotFoundError, ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);

  const newProfessional = await runInsertQuery(userInputValues);

  await runUpdateQuery(userInputValues.userId);

  return newProfessional;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          professional_profiles
          (user_id, username, full_name, phone_number, business_name, bio, specialty)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          *
      ;`,
      values: [
        userInputValues.userId,
        userInputValues.username,
        userInputValues.fullName,
        userInputValues.phoneNumber,
        userInputValues.businessName || null,
        userInputValues.bio || null,
        userInputValues.specialty,
      ],
    });

    return results.rows[0];
  }

  async function runUpdateQuery(userId) {
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
      values: [userId],
    });
  }
}

async function update(userId, userInputValues) {
  await findOneById(userId);

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
          user_id = $9
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
        userId,
      ],
    });

    return results.rows[0];
  }
}

async function findOneById(userId) {
  const userFound = await runSelectQuery(userId);
  return userFound;

  async function runSelectQuery(userId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          professional_profiles
        WHERE
          user_id = $1
        LIMIT
          1
      ;`,
      values: [userId],
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
