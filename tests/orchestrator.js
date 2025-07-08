import retry from "async-retry";
import { faker } from "@faker-js/faker";
import database from "infra/database.js";
import migrator from "models/migrator.js";
import user from "models/user.js";
import activation from "models/activation.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  return await user.create({
    email: userObject?.email || faker.internet.email(),
    password: userObject?.password || "validpassword",
  });
}

async function createAuthenticatedUser() {
  const newUser = await user.create({
    email: "authenticated@user.com",
    password: "validpassword",
  });

  const token = await activation.sendEmailVerificationToken(newUser);
  await activation.consumeEmailVerificationToken({ tokenId: token });

  const response = await fetch("http://localhost:3000/api/v1/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "authenticated@user.com",
      password: "validpassword",
    }),
  });

  const responseBody = await response.json();

  return { user: newUser, sessionId: responseBody.token };
}

async function fetchLastEmailInbox() {
  const response = await fetch("http://localhost:1080/messages");
  const messages = await response.json();

  if (messages.length === 0) {
    throw new Error("Nenhum email encontrado.");
  }

  const lastMessage = messages[messages.length - 1];
  const lastEmailDetails = await fetch(
    `http://localhost:1080/messages/${lastMessage.id}.json`,
  );

  return lastEmailDetails.json();
}

async function clearMailCatcherInbox() {
  await fetch("http://localhost:1080/messages", { method: "DELETE" });
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  fetchLastEmailInbox,
  clearMailCatcherInbox,
  createAuthenticatedUser,
};

export default orchestrator;
