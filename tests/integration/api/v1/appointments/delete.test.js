import orchestrator from "tests/orchestrator.js";
import { format, addDays } from "date-fns";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/appointments/[id]", () => {
  let authProfessional;
  let authClient;
  let targetDate;
  let targetTime;

  beforeEach(async () => {
    await orchestrator.clearDatabase();
    await orchestrator.runPendingMigrations();

    authProfessional = await orchestrator.createAuthenticatedProfessional();
    authClient = await orchestrator.createAuthenticatedProfessional({
      email: "client@test.com",
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
          startTime: "09:00",
          endTime: "10:00",
        },
      ]),
    });

    const today = new Date();
    const nextMonday = addDays(today, (1 - today.getDay() + 7) % 7 || 7);
    targetDate = format(nextMonday, "yyyy-MM-dd");
    targetTime = `${targetDate}T12:00:00.000Z`;
  });

  test("With valid data", async () => {
    const response = await fetch("http://localhost:3000/api/v1/appointments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authClient.sessionId}`,
      },
      body: JSON.stringify({
        professionalProfileId: authProfessional.professional.id,
        startTime: targetTime,
      }),
    });

    const responseBody = await response.json();

    const deleteAppointmentResponse = await fetch(
      `http://localhost:3000/api/v1/appointments/${responseBody.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${authClient.sessionId}`,
        },
      },
    );

    expect(deleteAppointmentResponse.status).toBe(204);
  });
});
