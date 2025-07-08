import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/professionals", () => {
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

    const changeProfessional = {
      username: "brunofeitoza",
      fullName: "Feitoza Bruno",
      phoneNumber: "88888888888",
      bio: "Estou testando o PATCH do endpoint.",
      specialty: "Desenvolvedor de Testes",
      businessName: "Jest",
      profilePhotoUrl: "https://example.com/photo.jpg",
      coverPictureUrl: "https://example.com/cover.jpg",
    };

    const updatedProfessional = await fetch(
      "http://localhost:3000/api/v1/professionals",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${authUser.sessionId}`,
        },
        body: JSON.stringify(changeProfessional),
      },
    );
    expect(updatedProfessional.status).toBe(200);

    const updatedProfessionalBody = await updatedProfessional.json();
    expect(updatedProfessionalBody.username).toEqual(
      changeProfessional.username,
    );
    expect(updatedProfessionalBody.full_name).toEqual(
      changeProfessional.fullName,
    );
    expect(updatedProfessionalBody.phone_number).toEqual(
      changeProfessional.phoneNumber,
    );
    expect(updatedProfessionalBody.bio).toEqual(changeProfessional.bio);
    expect(updatedProfessionalBody.specialty).toEqual(
      changeProfessional.specialty,
    );
    expect(updatedProfessionalBody.business_name).toEqual(
      changeProfessional.businessName,
    );
    expect;
  });
});
