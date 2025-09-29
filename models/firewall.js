import database from "infra/database.js";
import { RateLimitError } from "infra/errors.js";

const RESEND_EMAIL_LIMIT = 1;
const RESEND_EMAIL_WINDOW = "90 seconds";

async function checkRateLimit(ip, eventType) {
  let limit, window;
  if (eventType === "RESEND_VERIFICATION_EMAIL") {
    limit = RESEND_EMAIL_LIMIT;
    window = RESEND_EMAIL_WINDOW;
  } else {
    throw new Error("Tipo de evento de rate limit desconhecido.");
  }

  const countResult = await database.query({
    text: `
      SELECT
        count(*)
      FROM
        request_logs
      WHERE
        ip_address = $1
      AND
        event_type = $2
      AND
        created_at > NOW() - INTERVAL '${window}';
    `,
    values: [ip, eventType],
  });

  const requestCount = parseInt(countResult.rows[0].count);

  if (requestCount >= limit) {
    throw new RateLimitError({
      message: "Você excedeu o limite de requisições.",
      action: `Por favor, tente novamente após 90 segundos.`,
    });
  }

  await database.query({
    text: `
      INSERT INTO
        request_logs (ip_address, event_type)
      VALUES
        ($1, $2);
    `,
    values: [ip, eventType],
  });
}

const firewall = {
  checkRateLimit,
};

export default firewall;
