import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  test("With nonexistent 'username'", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/users/UsuarioInexistente",
      {
        method: "PATCH",
      },
    );

    expect(response.status).toBe(404);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "NotFoundError",
      message: "O username informado não foi encontrado no sistema.",
      action: "Verifique se o username está digitado corretamente.",
      status_code: 404,
    });
  });

  test("With duplicated 'username'", async () => {
    await orchestrator.createUser({
      username: "user1",
    });

    await orchestrator.createUser({
      username: "user2",
    });

    const response = await fetch("http://localhost:3000/api/v1/users/user2", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "user1",
      }),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "O username informado já está sendo utilizado.",
      action: "Utilize outro username para realizar essa operação.",
      status_code: 400,
    });
  });

  test("With duplicated 'email'", async () => {
    await orchestrator.createUser({
      email: "email1@gmail.com",
    });

    const createdUser2 = await orchestrator.createUser({
      email: "email2@gmail.com",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/users/${createdUser2.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email1@gmail.com",
        }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar essa operação.",
      status_code: 400,
    });
  });

  test("With unique 'username'", async () => {
    const createdUniqueUser1 = await orchestrator.createUser({
      username: "uniqueUser1",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/users/${createdUniqueUser1.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueUser2",
        }),
      },
    );

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      username: "uniqueUser2",
      email: createdUniqueUser1.email,
      email_verified_at: responseBody.email_verified_at,
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With unique 'email'", async () => {
    const createdUniqueEmail1 = await orchestrator.createUser({
      email: "uniqueEmail1@gmail.com",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/users/${createdUniqueEmail1.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "uniqueEmail2@gmail.com",
        }),
      },
    );

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      username: createdUniqueEmail1.username,
      email: "uniqueEmail2@gmail.com",
      email_verified_at: responseBody.email_verified_at,
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("With new 'password'", async () => {
    const createdUser = await orchestrator.createUser({
      password: "oldPassword",
    });

    const response = await fetch(
      `http://localhost:3000/api/v1/users/${createdUser.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "newPassword",
        }),
      },
    );

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      username: createdUser.username,
      email: createdUser.email,
      email_verified_at: responseBody.email_verified_at,
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    expect(responseBody.updated_at > responseBody.created_at).toBe(true);

    const userInDatabase = await user.findOneByUsername(createdUser.username);

    const correctPasswordMatch = await password.compare(
      "newPassword",
      userInDatabase.password,
    );

    const incorrectPasswordMatch = await password.compare(
      "oldPassword",
      userInDatabase.password,
    );

    expect(correctPasswordMatch).toBe(true);
    expect(incorrectPasswordMatch).toBe(false);
  });

  test("With invalid fields", async () => {
    const invalidBody = await orchestrator.createUser();

    const response = await fetch(
      `http://localhost:3000/api/v1/users/${invalidBody.username}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invalidKey: "invalidValue",
        }),
      },
    );

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Nenhum campo permitido para atualização foi informado.",
      action: "Informe ao menos um campo válido para atualização.",
      status_code: 400,
    });
  });
});
