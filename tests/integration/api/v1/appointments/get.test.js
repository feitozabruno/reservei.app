import orchestrator from "tests/orchestrator.js";
import { format } from "date-fns";
import { addDays } from "date-fns";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/professionals/:id/available-slots", () => {
  let authProfessional;

  beforeEach(async () => {
    await orchestrator.clearDatabase();
    await orchestrator.runPendingMigrations();

    authProfessional = await orchestrator.createAuthenticatedProfessional();

    await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify({
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "11:00",
      }),
    });
  });

  test("should return available slots for a professional on a specific date", async () => {
    const today = new Date();
    const nextMonday = addDays(today, (1 - today.getDay() + 7) % 7 || 7);
    const targetDate = format(nextMonday, "yyyy-MM-dd");

    const response = await fetch(
      `http://localhost:3000/api/v1/professionals/${authProfessional.professional.id}/available-slots?date=${targetDate}`,
    );

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBe(4);
    expect(responseBody[0]).toContain(`${targetDate}T12:00:00`);
  });

  test("should return fewer slots if one is already booked", async () => {
    const authClient = await orchestrator.createAuthenticatedProfessional({
      email: "client@test.com",
    });

    const today = new Date();
    const nextMonday = addDays(today, (1 - today.getDay() + 7) % 7 || 7);
    const targetDate = format(nextMonday, "yyyy-MM-dd");
    const targetTime = `${targetDate}T12:30:00.000Z`;

    const appointmentResponse = await fetch(
      "http://localhost:3000/api/v1/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${authClient.sessionId}`,
        },
        body: JSON.stringify({
          professionalProfileId: authProfessional.professional.id,
          startTime: targetTime,
        }),
      },
    );

    expect(appointmentResponse.status).toBe(201);

    const response = await fetch(
      `http://localhost:3000/api/v1/professionals/${authProfessional.professional.id}/available-slots?date=${targetDate}`,
    );

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(responseBody.find((slot) => slot === targetTime)).toBeUndefined();
  });

  test("should return an empty array for a day with no availability", async () => {
    const today = new Date();
    const nextTuesday = addDays(today, (2 - today.getDay() + 7) % 7 || 7);
    const targetDate = format(nextTuesday, "yyyy-MM-dd");

    const response = await fetch(
      `http://localhost:3000/api/v1/professionals/${authProfessional.professional.id}/available-slots?date=${targetDate}`,
    );

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(0);
  });
});
