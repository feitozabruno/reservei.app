import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  test("Retrieving current system status", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    const responseBody = await response.json();
    const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

    expect(response.status).toBe(200);
    expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
    expect(responseBody.dependencies.database.version).toEqual("17.5");
    expect(responseBody.dependencies.database.max_connections).toEqual(100);
    expect(responseBody.dependencies.database.open_connections).toEqual(1);
  });
});
