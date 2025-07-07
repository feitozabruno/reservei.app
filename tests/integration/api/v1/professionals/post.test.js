import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/professionals", () => {
  test("With valid data", async () => {
    const authUser = await orchestrator.createAuthenticatedUser();

    const professional = {
      username: "feitozabruno",
      fullName: "Bruno Feitoza",
      phoneNumber: "99999999999",
      bio: "Escrevo código limpo, testado e bem documentado.",
      specialty: "Desenvolvedor Web",
      businessName: "GitHub",
    };

    const newProfessional = await fetch(
      "http://localhost:3000/api/v1/professionals",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${authUser.sessionId}`,
        },
        body: JSON.stringify(professional),
      },
    );
    expect(newProfessional.status).toBe(201);

    const newProfessionalBody = await newProfessional.json();
    expect(newProfessionalBody.username).toEqual(professional.username);
    expect(newProfessionalBody.full_name).toEqual(professional.fullName);
    expect(newProfessionalBody.phone_number).toEqual(professional.phoneNumber);
    expect(newProfessionalBody.bio).toEqual(professional.bio);
    expect(newProfessionalBody.specialty).toEqual(professional.specialty);
    expect(newProfessionalBody.business_name).toEqual(
      professional.businessName,
    );
  });
});
