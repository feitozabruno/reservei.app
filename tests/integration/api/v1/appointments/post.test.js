import orchestrator from "tests/orchestrator.js";
import { format, addDays } from "date-fns";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/appointments", () => {
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
      body: JSON.stringify({
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "10:00",
      }),
    });

    const today = new Date();
    const nextMonday = addDays(today, (1 - today.getDay() + 7) % 7 || 7);
    targetDate = format(nextMonday, "yyyy-MM-dd");
    targetTime = `${targetDate}T12:00:00.000Z`;
  });

  test("should allow a client to create an appointment in a valid slot", async () => {
    const response = await fetch("http://localhost:3000/api/v1/appointments", {
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

    expect(response.status).toBe(201);
    expect(responseBody.professional_id).toBe(authProfessional.professional.id);
    expect(responseBody.client_id).toBe(authClient.user.user.id);
    expect(responseBody.start_time).toBe(targetTime);
    expect(responseBody.status).toBe("SCHEDULED");
  });

  test("should return 400 when trying to book an invalid slot", async () => {
    const invalidTime = `${targetDate}T08:00:00.000Z`;

    const response = await fetch("http://localhost:3000/api/v1/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authClient.sessionId}`,
      },
      body: JSON.stringify({
        professionalProfileId: authProfessional.professional.id,
        startTime: invalidTime,
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.name).toBe("ValidationError");
    expect(responseBody.message).toContain(
      "O horário solicitado não é um slot de agendamento válido",
    );
  });

  test("should return 400 when trying to book an already booked slot", async () => {
    await fetch("http://localhost:3000/api/v1/appointments", {
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

    const anotherAuthClient =
      await orchestrator.createAuthenticatedProfessional({
        email: "another.client@test.com",
      });
    const response = await fetch("http://localhost:3000/api/v1/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${anotherAuthClient.sessionId}`,
      },
      body: JSON.stringify({
        professionalProfileId: authProfessional.professional.id,
        startTime: targetTime,
      }),
    });

    expect(response.status).toBe(400);
  });
});
