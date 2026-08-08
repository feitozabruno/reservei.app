using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Reservei.Api.DTOs.Professional;
using Reservei.Api.Models;
using Reservei.Api.Tests.Fixtures;

namespace Reservei.Api.Tests.Integration;

public class ProfessionalTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly AuthHelper _auth;

    public ProfessionalTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _auth = new AuthHelper(_client);
    }

    [Fact]
    public async Task Create_WithValidData_ReturnCreated()
    {
        var loggedUser = await _auth.CreateLoggedUser();

        var dto = new CreateProfessionalDto
        {
            Username = "johndoe",
            FullName = "John Doe",
            Specialty = "Desenvolvedor de Software",
            BusinessName = "GitHub",
            PhoneNumber = "67987654321",
            Bio = "Escrevo código limpo, padronizado, testado e bem documentado.",
            AddressCep = "79800-000",
            AddressStreet = "Rua Zuckenberg",
            AddressNumber = "789",
            AddressNeightborhood = "Centro",
            AddressCity = "São Francisco",
            AddressState = "MS",
            AddressComplement = "Próximo a empresa Meta"
        };

        var request1 = new HttpRequestMessage(HttpMethod.Post, "/api/professionals")
        {
            Content = JsonContent.Create(dto)
        };
        request1.Headers.Add("Cookie", loggedUser.Token);

        var response1 = await _client.SendAsync(request1);
        var body1 = await response1.Content.ReadAsStringAsync();
        response1.StatusCode.Should().Be(HttpStatusCode.Created);
        body1.Should().Be("Perfil profissional criado com sucesso.");

        var request2 = new HttpRequestMessage(HttpMethod.Get, "/api/professionals/me");
        request2.Headers.Add("Cookie", loggedUser.Token);
        var response2 = await _client.SendAsync(request2);
        var body2 = await response2.Content.ReadFromJsonAsync<Professional>();

        body2?.Username.Should().Be(dto.Username);
        body2?.FullName.Should().Be(dto.FullName);
        body2?.Specialty.Should().Be(dto.Specialty);
        body2?.BusinessName.Should().Be(dto.BusinessName);
        body2?.PhoneNumber.Should().Be(dto.PhoneNumber);
        body2?.Bio.Should().Be(dto.Bio);
        body2?.AddressCep.Should().Be(dto.AddressCep);
        body2?.AddressStreet.Should().Be(dto.AddressStreet);
        body2?.AddressNumber.Should().Be(dto.AddressNumber);
        body2?.AddressNeightborhood.Should().Be(dto.AddressNeightborhood);
        body2?.AddressCity.Should().Be(dto.AddressCity);
        body2?.AddressState.Should().Be(dto.AddressState);
        body2?.AddressComplement.Should().Be(dto.AddressComplement);
    }

    [Fact]
    public async Task Create_WithInvalidData_ReturnBadRequest()
    {
        var loggedUser = await _auth.CreateLoggedUser();

        var dto = new
        {
            Username = "johndoe",
            FullName = "John Doe",
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/professionals")
        {
            Content = JsonContent.Create(dto)
        };
        request.Headers.Add("Cookie", loggedUser.Token);

        var response = await _client.SendAsync(request);
        var body = await response.Content.ReadFromJsonAsync<ProblemDetailsResponse>();

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        body?.Title.Should().Be("Erro de validação");
        body?.Status.Should().Be(400);
        body?.Instance.Should().Be("/api/professionals");
    }

    [Fact]
    public async Task Create_WithInvalidUser_ReturnUnauthorized()
    {
        var dto = new CreateProfessionalDto
        {
            Username = "johndoe",
            FullName = "John Doe",
            Specialty = "Desenvolvedor de Software",
            BusinessName = "GitHub",
            PhoneNumber = "67987654321",
            Bio = "Escrevo código limpo, padronizado, testado e bem documentado.",
            AddressCep = "79800-000",
            AddressStreet = "Rua Zuckenberg",
            AddressNumber = "789",
            AddressNeightborhood = "Centro",
            AddressCity = "São Francisco",
            AddressState = "MS",
            AddressComplement = "Próximo a empresa Meta"
        };

        var response = await _client.PostAsJsonAsync("/api/professionals", dto);
        var body = await response.Content.ReadFromJsonAsync<ProblemDetailsResponse>();

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        body?.Title.Should().Be("Erro de não autorizado");
        body?.Status.Should().Be(401);
        body?.Detail.Should().Be("Usuário não autenticado.");
        body?.Instance.Should().Be("/api/professionals");
    }
}