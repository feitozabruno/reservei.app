import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.clearMailCatcherInbox();
  await orchestrator.runPendingMigrations();
});

const appBaseUrl = "http://localhost:3000";
const mailcatcherApiUrl = "http://localhost:1080";

describe("GET /api/v1/auth", () => {
  test("User Registration and Verification", async () => {
    const newUserPayload = {
      username: "cicrano",
      email: "cicrano@teste.com",
      password: "password123",
    };

    const createUserResponse = await fetch(`${appBaseUrl}/api/v1/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserPayload),
    });
    const createUserBody = await createUserResponse.json();
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
    const tokenRegex = /token=([a-f0-9]{64})/;
    const match = emailHtmlBody.match(tokenRegex);
    expect(match).not.toBeNull();

    const verificationToken = match[1];
    const verifyEmailResponse = await fetch(
      `${appBaseUrl}/api/v1/auth/verify-email?token=${verificationToken}`,
    );
    expect(verifyEmailResponse.status).toBe(200);

    const verifyEmailBody = await verifyEmailResponse.json();
    expect(verifyEmailBody.message).toBe("Email verificado com sucesso.");
    expect(verifyEmailBody.user.email).toBe(newUserPayload.email);

    const userInDbResult = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          id = $1
      ;`,
      values: [createUserBody.id],
    });

    const finalUserStatus = userInDbResult.rows[0];
    expect(finalUserStatus.email_verified_at).not.toBeNull();

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
