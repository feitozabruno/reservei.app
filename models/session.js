import crypto from "node:crypto";
import database from "infra/database.js";

const EXPIRATION_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000; // 30 days

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          sessions (token, user_id, expires_at)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      ;`,
      values: [token, userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function validate(token) {
  const results = await database.query({
    text: `
      SELECT
        user_id
      FROM
        sessions
      WHERE
        token = $1
      AND
        expires_at > NOW()
    ;`,
    values: [token],
  });

  return results.rows[0].user_id || null;
}

const session = {
  create,
  validate,
  EXPIRATION_IN_MILLISECONDS,
};

export default session;
