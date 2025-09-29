import bcryptjs from "bcryptjs";
import crypto from "node:crypto";
import database from "infra/database.js";
import email from "infra/email.js";
import user from "models/user.js";

async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function requestReset(emailAddress) {
  const targetUser = await user.findOneByEmail(emailAddress);

  if (targetUser) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await database.query({
      text: `
      INSERT INTO
        password_reset_tokens
        (user_id, token, expires_at)
      VALUES
        ($1, $2, $3)
    ;`,
      values: [targetUser.id, rawToken, expiresAt],
    });

    const resetUrl = createResetPasswordUrl(rawToken);

    await email.send({
      to: targetUser.email,
      subject: "Redefinição de senha",
      text: `Olá! Para redefinir sua senha, acesse o seguinte link: ${resetUrl}`,
      html: `
      <p>Olá!</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
      <p>
        <a href="${resetUrl}"><strong>Clique aqui para criar uma nova senha</strong></a>
      </p>
      <p>Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
      <p>O link expira em 30 minutos.</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Equipe reservei.app</p>
    `,
    });
  }

  // timing attack mitigation
  const randomDelay = Math.random() * (300 - 100) + 100; // 100ms ~ 300ms
  await new Promise((resolve) => setTimeout(resolve, randomDelay));
  return;
}

async function reset({ token, newPassword }) {
  const result = await database.query({
    text: `
      SELECT
        user_id, expires_at
      FROM
        password_reset_tokens
      WHERE
        token = $1
    ;`,
    values: [token],
  });

  const tokenData = result.rows[0];

  if (!tokenData || new Date() > new Date(tokenData.expires_at)) {
    return false;
  }

  await user.update(tokenData.user_id, { password: newPassword });

  await database.query({
    text: `
      DELETE FROM
        sessions
      WHERE
        user_id = $1
    ;`,
    values: [tokenData.user_id],
  });

  await database.query({
    text: `
      DELETE FROM
        password_reset_tokens
      WHERE
        token = $1
    ;`,
    values: [token],
  });

  return true;
}

function createResetPasswordUrl(token) {
  let host;
  if (process.env.NODE_ENV === "development") {
    host = "http://localhost:3000";
  } else {
    host = `https://${process.env.VERCEL_URL}`;
  }
  return `${host}/redefinir-senha?token=${token}`;
}

const password = {
  hash,
  compare,
  requestReset,
  reset,
};

export default password;
