import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  test("With unique and valid data", async () => {
    const response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "reservei",
        email: "contato@reservei.app",
        password: "senha123",
      }),
    });
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody).toEqual({
      id: responseBody.id,
      username: "reservei",
      email: "contato@reservei.app",
      email_verified_at: responseBody.email_verified_at,
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    const userInDatabase = await user.findOneByUsername("reservei");

    const correctPasswordMatch = await password.compare(
      "senha123",
      userInDatabase.password,
    );

    const incorrectPasswordMatch = await password.compare(
      "SenhaErrada",
      userInDatabase.password,
    );

    expect(correctPasswordMatch).toBe(true);
    expect(incorrectPasswordMatch).toBe(false);
  });

  test("With duplicated 'email'", async () => {
    const response1 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "emailduplicado1",
        email: "duplicado@gmail.com",
        password: "senha123",
      }),
    });
    expect(response1.status).toBe(201);

    const response2 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "emailduplicado2",
        email: "Duplicado@gmail.com",
        password: "senha123",
      }),
    });

    expect(response2.status).toBe(400);

    const response2Body = await response2.json();

    expect(response2Body).toEqual({
      name: "ValidationError",
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar essa operação.",
      status_code: 400,
    });
  });

  test("With duplicated 'username'", async () => {
    const response1 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "usernameduplicado",
        email: "usernameduplicado1@gmail.com",
        password: "senha123",
      }),
    });
    expect(response1.status).toBe(201);

    const response2 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Usernameduplicado",
        email: "usernameduplicado2@gmail.com",
        password: "senha123",
      }),
    });

    expect(response2.status).toBe(400);

    const response2Body = await response2.json();

    expect(response2Body).toEqual({
      name: "ValidationError",
      message: "O nome de usuário já está sendo utilizado.",
      action: "Utilize outro nome de usuário para realizar essa operação.",
      status_code: 400,
    });
  });
});
