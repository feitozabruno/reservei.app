using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Reservei.Api.DTOs.Service;
using Reservei.Api.Tests.Fixtures;

namespace Reservei.Api.Tests.Integration;

public class ServiceTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly AuthHelper _auth;

    public ServiceTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _auth = new AuthHelper(_client);
    }

    [Fact]
    public async Task Create_WithValidData_ReturnCreated()
    {
        var profile = await _auth.CreateProfessional();

        var dto = new CreateServiceDto
        {
            Name = "Terapia",
            Description = "Sessão de terapia comportamental.",
            Price = 350,
            DurationMinutes = 60
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/services")
        {
            Content = JsonContent.Create(dto)
        };
        request.Headers.Add("Cookie", profile.User.Token);

        var response = await _client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        body.Should().Be("Serviço criado com sucesso.");

        var request2 = new HttpRequestMessage(HttpMethod.Get, "/api/services/me");
        request2.Headers.Add("Cookie", profile.User.Token);
        var response2 = await _client.SendAsync(request2);
        var body2 = await response2.Content.ReadFromJsonAsync<IEnumerable<ServiceResponseDto>>();

        var expected = new List<ServiceResponseDto>
        {
            new() {
                Id = (Guid)(body2?.First().Id)!,
                ProfessionalId = profile.Professional.Id,
                Name = "Terapia",
                Description = "Sessão de terapia comportamental.",
                Price = 350,
                DurationMinutes = 60
            }
        };

        response2.StatusCode.Should().Be(HttpStatusCode.OK);
        body2.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task CreateMany_WithValidData_ReturnCreated()
    {
        var profile = await _auth.CreateProfessional();

        var dto = new List<CreateServiceDto>()
        {
            new CreateServiceDto {
                Name = "Consultoria API",
                Description = "Especialista em backend.",
                Price = 150,
                DurationMinutes = 60,
            },

            new CreateServiceDto {
                Name = "Consultoria Banco de Dados",
                Description = "Especialista em SQL Server e Postgres.",
                Price = 200.99m,
                DurationMinutes = 60,
            },
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/services/batch")
        {
            Content = JsonContent.Create(dto)
        };
        request.Headers.Add("Cookie", profile.User.Token);

        var response = await _client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        body.Should().Be("Serviços criados com sucesso.");

        var request2 = new HttpRequestMessage(HttpMethod.Get, "/api/services/me");
        request2.Headers.Add("Cookie", profile.User.Token);
        var response2 = await _client.SendAsync(request2);
        var body2 = await response2.Content.ReadFromJsonAsync<IEnumerable<ServiceResponseDto>>();

        var expected = new List<ServiceResponseDto>
        {
            new() {
                ProfessionalId = profile.Professional.Id,
                Name = "Consultoria API",
                Description = "Especialista em backend.",
                Price = 150,
                DurationMinutes = 60,
            },
            new() {
                ProfessionalId = profile.Professional.Id,
                Name = "Consultoria Banco de Dados",
                Description = "Especialista em SQL Server e Postgres.",
                Price = 200.99m,
                DurationMinutes = 60,
            }
        };

        response2.StatusCode.Should().Be(HttpStatusCode.OK);
        body2.Should().BeEquivalentTo(expected, options => options
            .Excluding(x => x.Id)
            .WithoutStrictOrdering());
    }
}