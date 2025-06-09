import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/subscribe", () => {
  test("With valid email", async () => {
    const response = await fetch("http://localhost:3000/api/v1/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "valido@email.com" }),
    });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.message).toBe("Inscrição realizada com sucesso!");
  });

  test("With invalid email", async () => {
    const response = await fetch("http://localhost:3000/api/v1/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalido" }),
    });
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "O formato do e-mail fornecido é inválido ou muito longo.",
      action: "Por favor, insira um e-mail válido com até 254 caracteres.",
      status_code: 400,
    });
  });

  test("With empty email", async () => {
    const response = await fetch("http://localhost:3000/api/v1/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "" }),
    });
    const responseBody = await response.json();
    expect(response.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "O formato do e-mail fornecido é inválido ou muito longo.",
      action: "Por favor, insira um e-mail válido com até 254 caracteres.",
      status_code: 400,
    });
  });

  test("Without email field", async () => {
    const response = await fetch("http://localhost:3000/api/v1/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "O formato do e-mail fornecido é inválido ou muito longo.",
      action: "Por favor, insira um e-mail válido com até 254 caracteres.",
      status_code: 400,
    });
  });

  test("With too long email", async () => {
    const longEmail = "a".repeat(250) + "@mail.com";
    const response = await fetch("http://localhost:3000/api/v1/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: longEmail }),
    });
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "O formato do e-mail fornecido é inválido ou muito longo.",
      action: "Por favor, insira um e-mail válido com até 254 caracteres.",
      status_code: 400,
    });
  });

  test("When external service returns error", async () => {
    const response = await fetch("http://localhost:3000/api/v1/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "serviceerror@email.com",
        _forceServiceError: true,
      }),
    });
    const responseBody = await response.json();

    expect(response.status).toBe(503);
    expect(responseBody).toEqual({
      name: "ServiceError",
      message: "O serviço de inscrição retornou um erro inesperado.",
      action: "Aguarde alguns instantes e tente novamente.",
      status_code: 503,
    });
  });
});
