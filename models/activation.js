import crypto from "node:crypto";
import database from "infra/database.js";
import { NotFoundError } from "infra/errors.js";
import email from "infra/email.js";

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function createVerificationUrl(tokenId) {
  let host;
  if (process.env.NODE_ENV === "development") {
    host = "http://localhost:3000";
  } else {
    host = `https://${process.env.VERCEL_URL}`;
  }
  return `${host}/ativar-conta/${tokenId}`;
}

async function sendEmailVerificationToken(user) {
  const { id: userId, email: userEmail } = user;
  const tokenId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ONE_DAY_IN_MILLISECONDS);

  await database.query({
    text: `
      INSERT INTO
        user_verification_tokens (user_id, token, expires_at)
      VALUES
        ($1, $2, $3)
    ;`,
    values: [userId, tokenId, expiresAt],
  });

  const verificationUrl = createVerificationUrl(tokenId);

  await email.send({
    to: userEmail,
    subject: "Ative seu cadastro no reservei.app",
    text: `
      Olá! utilize o link abaixo para ativar seu cadastro no reservei.app:

      ${verificationUrl}

      Caso você não tenha feito essa requisição, ignore esse email.

      Atenciosamente,
      Equipe reservei.app
    `,
    html: `
      <p>Olá! clique no link abaixo para ativar seu cadastro no reservei.app:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <br />
      <p>Caso você não tenha feito essa requisição, ignore esse email.</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Equipe reservei.app</p>
    `,
  });

  return tokenId;
}

async function consumeEmailVerificationToken(token) {
  const { tokenId } = token;

  const validToken = await database.query({
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
    values: [tokenId],
  });

  if (validToken.rowCount === 0) {
    throw new NotFoundError({
      message: "Token de verificação inválido ou expirado.",
      action: "Certifique-se de que o token é válido e não expirou.",
    });
  }

  const { user_id } = validToken.rows[0];

  const updateVerifiedUser = await database.query({
    text: `
      UPDATE
        users
      SET
        email_verified_at = NOW(),
        updated_at = NOW()
      WHERE
        id = $1
      RETURNING
        id
    ;`,
    values: [user_id],
  });

  await runDeleteQuery(user_id);

  return updateVerifiedUser.rows[0];
}

async function resendEmailVerification(user) {
  await runDeleteQuery(user.id);
  await sendEmailVerificationToken(user);
}

async function runDeleteQuery(userId) {
  await database.query({
    text: `
      DELETE FROM
        user_verification_tokens
      WHERE
        user_id = $1
    ;`,
    values: [userId],
  });
}

const activation = {
  sendEmailVerificationToken,
  consumeEmailVerificationToken,
  resendEmailVerification,
};

export default activation;
