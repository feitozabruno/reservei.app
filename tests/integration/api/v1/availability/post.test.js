import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/availability", () => {
  test("With unique and valid data", async () => {
    const authProfessional =
      await orchestrator.createAuthenticatedProfessional();

    const response = await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify({
        dayOfWeek: 1,
        startTime: "07:00",
        endTime: "11:00",
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody).toEqual({
      id: responseBody.id,
      professional_id: responseBody.professional_id,
      day_of_week: 1,
      start_time: "07:00:00",
      end_time: "11:00:00",
      created_at: responseBody.created_at,
    });
    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(uuidVersion(responseBody.professional_id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
  });

  test("With duplicated and valid data", async () => {
    const authProfessional = await orchestrator.createAuthenticatedProfessional(
      {
        email: "authenticated2@user.com",
      },
    );

    const response1 = await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify({
        dayOfWeek: 1,
        startTime: "07:00",
        endTime: "11:00",
      }),
    });

    const responseBody1 = await response1.json();

    expect(response1.status).toBe(201);
    expect(responseBody1).toEqual({
      id: responseBody1.id,
      professional_id: responseBody1.professional_id,
      day_of_week: 1,
      start_time: "07:00:00",
      end_time: "11:00:00",
      created_at: responseBody1.created_at,
    });
    expect(uuidVersion(responseBody1.id)).toBe(4);
    expect(uuidVersion(responseBody1.professional_id)).toBe(4);
    expect(Date.parse(responseBody1.created_at)).not.toBeNaN();

    const response2 = await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify({
        dayOfWeek: 1,
        startTime: "07:00",
        endTime: "11:00",
      }),
    });

    const responseBody2 = await response2.json();

    expect(response2.status).toBe(400);
    expect(responseBody2).toEqual({
      name: "ValidationError",
      message: "O horário fornecido se sobrepõe a um horário já cadastrado.",
      action: "Ajuste os horários para que não haja conflitos.",
      status_code: 400,
    });
  });

  test("With invalid data", async () => {
    const authProfessional = await orchestrator.createAuthenticatedProfessional(
      {
        email: "authenticated3@user.com",
      },
    );

    const response1 = await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify({
        dayOfWeek: 55,
        startTime: "07:00",
        endTime: "11:00",
      }),
    });

    const responseBody1 = await response1.json();

    expect(response1.status).toBe(400);
    expect(responseBody1).toEqual({
      name: "ValidationError",
      message:
        "O dia da semana deve ser um valor entre 0 (Domingo) e 6 (Sábado).",
      action: "Verifique o campo 'dayOfWeek' e tente novamente.",
      status_code: 400,
    });

    const response2 = await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify({
        dayOfWeek: 2,
        startTime: "07:00:55",
        endTime: "11:00",
      }),
    });

    const responseBody2 = await response2.json();

    expect(response2.status).toBe(400);
    expect(responseBody2).toEqual({
      name: "ValidationError",
      message: "Formato de hora inválido. Use HH:mm.",
      action: "Verifique o campo 'startTime' e tente novamente.",
      status_code: 400,
    });

    const response3 = await fetch("http://localhost:3000/api/v1/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authProfessional.sessionId}`,
      },
      body: JSON.stringify({
        dayOfWeek: 3,
        startTime: "07:00",
        endTime: "11:00:15",
      }),
    });

    const responseBody3 = await response3.json();

    expect(response3.status).toBe(400);
    expect(responseBody3).toEqual({
      name: "ValidationError",
      message: "Formato de hora inválido. Use HH:mm.",
      action: "Verifique o campo 'endTime' e tente novamente.",
      status_code: 400,
    });
  });
});
