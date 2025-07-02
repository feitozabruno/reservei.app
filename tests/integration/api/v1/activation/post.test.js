import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";
import user from "models/user.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.clearMailCatcherInbox();
  await orchestrator.runPendingMigrations();
});

const appBaseUrl = "http://localhost:3000";
const mailcatcherApiUrl = "http://localhost:1080";

describe("POST /api/v1/activation", () => {
  test("With valid 'user' and valid 'token'", async () => {
    const newUserPayload = {
      email: "user@teste.com",
      password: "password123",
    };

    const createUserResponse = await fetch(`${appBaseUrl}/api/v1/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserPayload),
    });
    expect(createUserResponse.status).toBe(201);

    const messagesResponse = await fetch(`${mailcatcherApiUrl}/messages`);
    const messages = await messagesResponse.json();
    const sentEmail = messages[0];
    expect(messages).toHaveLength(1);
    expect(sentEmail.recipients).toContain(`<${newUserPayload.email}>`);

    const messageDetailsResponse = await fetch(
      `${mailcatcherApiUrl}/messages/${sentEmail.id}.html`,
    );

    const emailHtmlBody = await messageDetailsResponse.text();
    const tokenRegex = /([a-f0-9]{64})/;
    const match = emailHtmlBody.match(tokenRegex);
    expect(match).not.toBeNull();

    const verificationToken = match[1];
    const verifyEmailResponse = await fetch(`${appBaseUrl}/api/v1/activation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId: verificationToken }),
    });

    expect(verifyEmailResponse.status).toBe(200);

    const verifyEmailBody = await verifyEmailResponse.json();
    expect(verifyEmailBody.message).toBe("Email verificado com sucesso.");

    const userInDbResult = await user.findOneByEmail(newUserPayload.email);
    expect(userInDbResult.email_verified_at).not.toBeNull();

    const createUserBody = await createUserResponse.json();
    const tokenInDbResult = await database.query({
      text: `
        SELECT
          *
        FROM
          user_verification_tokens
        WHERE
          user_id = $1
        ;`,
      values: [createUserBody.id],
    });
    expect(tokenInDbResult.rowCount).toBe(0);
  });
});
