import database from "infra/database.js";
import { NotFoundError } from "infra/errors.js";

async function create(userInputValues) {
  const newClient = await runInsertQuery(userInputValues);

  await runUpdateQuery(userInputValues.userId);

  return newClient;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          client_profiles
          (user_id, full_name, phone_number, profile_photo_url)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *
      ;`,
      values: [
        userInputValues.userId,
        userInputValues.fullName,
        userInputValues.phoneNumber,
        userInputValues.profilePhotoUrl || null,
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
          role = 'CLIENT',
          updated_at = NOW()
        WHERE
          id = $1
      ;`,
      values: [userId],
    });
  }
}

async function update(clientId, clientInputValues) {
  await findOneById(clientId);

  const updatedClient = await runUpdateQuery(clientInputValues);
  return updatedClient;

  async function runUpdateQuery(clientInputValues) {
    const results = await database.query({
      text: `
        UPDATE
          client_profiles
        SET
          full_name = COALESCE($1, full_name),
          phone_number = COALESCE($2, phone_number),
          profile_photo_url = COALESCE($3, profile_photo_url),
          updated_at = NOW()
        WHERE
          id = $4
        RETURNING
          *
      ;`,
      values: [
        clientInputValues.fullName,
        clientInputValues.phoneNumber,
        clientInputValues.profilePhotoUrl,
        clientId,
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
          client_profiles
        WHERE
          id = $1 OR user_id = $1
        LIMIT
          1
      ;`,
      values: [id],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O Cliente informado não foi encontrado no sistema.",
        action: "Verifique se o ID do usuário está correto.",
      });
    }

    return results.rows[0];
  }
}

const client = {
  create,
  update,
  findOneById,
};

export default client;
