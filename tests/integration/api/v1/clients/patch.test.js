import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/clients/:id", () => {
  test("With valid data", async () => {
    const authUser = await orchestrator.createAuthenticatedUser();

    const client = {
      fullName: "Bruno Feitoza",
      phoneNumber: "99999999999",
    };

    const newClient = await fetch("http://localhost:3000/api/v1/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${authUser.sessionId}`,
      },
      body: JSON.stringify(client),
    });
    expect(newClient.status).toBe(201);
    const newClientBody = await newClient.json();

    const changeClient = {
      fullName: "Feitoza Bruno",
      phoneNumber: "88888888888",
      profilePhotoUrl: "https://xyz.public.blob.vercel-storage.com/abc123.jpg",
    };

    const updatedClient = await fetch(
      `http://localhost:3000/api/v1/clients/${newClientBody.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${authUser.sessionId}`,
        },
        body: JSON.stringify(changeClient),
      },
    );
    expect(updatedClient.status).toBe(200);

    const updatedClientBody = await updatedClient.json();
    expect(updatedClientBody.full_name).toEqual(changeClient.fullName);
    expect(updatedClientBody.phone_number).toEqual(changeClient.phoneNumber);
    expect(updatedClientBody.profile_photo_url).toEqual(
      changeClient.profilePhotoUrl,
    );
  });
});
