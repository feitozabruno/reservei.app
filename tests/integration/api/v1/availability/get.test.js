import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/availability", () => {
  test("With unique and valid data", async () => {
    const authProfessional =
      await orchestrator.createAuthenticatedProfessional();

    await fetch("http://localhost:3000/api/v1/availability", {
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

    await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify([
        {
          dayOfWeek: 1,
          startTime: "13:00",
          endTime: "17:00",
        },
      ]),
    });

    const response = await fetch("http://localhost:3000/api/v1/availability", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
    });

    const responseBody = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
  });
});
