import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/availability", () => {
  test("With unique and valid data", async () => {
    const authProfessional =
      await orchestrator.createAuthenticatedProfessional();

    const response = await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify([
        {
          dayOfWeek: 1,
          startTime: "07:00",
          endTime: "11:00",
        },
      ]),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);

    const deleteResponse = await fetch(
      `http://localhost:3000/api/v1/availability/?id=${responseBody[0].id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${authProfessional.sessionId}`,
        },
      },
    );

    expect(deleteResponse.status).toBe(200);
  });
});
