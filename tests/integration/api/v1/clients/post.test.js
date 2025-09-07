import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/clients", () => {
  test("With valid data", async () => {
    const authUser = await orchestrator.createAuthenticatedUser();

    const client = {
      fullName: "Bruno Feitoza",
      phoneNumber: "99999999999",
    };

    const newClient = await fetch("http://localhost:3000/api/v1/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authUser.sessionId}`,
      },
      body: JSON.stringify(client),
    });
    expect(newClient.status).toBe(201);

    const newClientBody = await newClient.json();
    expect(newClientBody.full_name).toEqual(client.fullName);
    expect(newClientBody.phone_number).toEqual(client.phoneNumber);
  });
});
