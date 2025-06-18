import crypto from "node:crypto";
import database from "infra/database.js";
import { NotFoundError, ValidationError } from "infra/errors.js";

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

async function createEmailVerificationToken(userId) {
  validateInputUserId(userId);

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ONE_DAY_IN_MILLISECONDS);

  await database.query({
    text: `
      INSERT INTO
        user_verification_tokens (user_id, token, expires_at)
      VALUES
        ($1, $2, $3)
    ;`,
    values: [userId, token, expiresAt],
  });

  return token;
}

async function verifyEmailToken(token) {
  validateInputToken(token);

  const tokenResult = await database.query({
    text: `
      SELECT
        user_id
      FROM
        user_verification_tokens
      WHERE
        token = $1
      AND
        expires_at > NOW()
    ;`,
    values: [token],
  });

  if (tokenResult.rowCount === 0) {
    throw new NotFoundError({
      message: "Token de verificação inválido ou expirado.",
      action: "Certifique-se de que o token é válido e não expirou.",
    });
  }

  const { user_id } = tokenResult.rows[0];

  const updateUserResult = await database.query({
    text: `
      UPDATE
        users
      SET
        email_verified_at = NOW(),
        updated_at = NOW()
      WHERE
        id = $1
      RETURNING
        id, username, email, email_verified_at
    ;`,
    values: [user_id],
  });

  await database.query({
    text: `
      DELETE FROM
        user_verification_tokens
      WHERE
        user_id = $1
    ;`,
    values: [user_id],
  });

  return updateUserResult.rows[0];
}

function validateInputUserId(userId) {
  if (!userId || typeof userId !== "string") {
    throw new ValidationError({
      message: "O ID do usuário é obrigatório para criar um token.",
      action:
        "Certifique-se de que o ID do usuário está sendo passado corretamente.",
    });
  }
}

function validateInputToken(token) {
  if (!token || typeof token !== "string") {
    throw new ValidationError({
      message: "Token de verificação inválido ou não fornecido.",
      action: "Certifique-se de que o token está sendo passado corretamente.",
    });
  }
}

const authentication = {
  createEmailVerificationToken,
  verifyEmailToken,
};

export default authentication;
