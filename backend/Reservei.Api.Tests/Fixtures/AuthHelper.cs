using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;
using Reservei.Api.DTOs.Auth;
using Reservei.Api.DTOs.Availability;
using Reservei.Api.DTOs.Professional;
using Reservei.Api.DTOs.Service;
using Reservei.Api.Models;

namespace Reservei.Api.Tests.Fixtures;

public class AuthHelper(HttpClient client)
{
    private readonly HttpClient _client = client;
    private static string UniqueEmail() => $"test_{Guid.NewGuid()}@email.com";

    public async Task<CreatedUser> CreateUserAsync(
        string email = "",
        string password = "JohnPassword")
    {
        if (string.IsNullOrEmpty(email)) email = UniqueEmail();

        var dto = new RegisterDto
        {
            Email = email,
            Password = password
        };

        await _client.PostAsJsonAsync("/api/auth/register", dto);

        return new CreatedUser(email, password);
    }

    public async Task<LoggedUser> CreateLoggedUser()
    {
        var user = await CreateUserAsync();
        var dto = new LoginDto { Email = user.Email, Password = user.Password };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);

        var rawCookie = response.Headers.GetValues("Set-Cookie").First();
        var cookie = SetCookieHeaderValue.Parse(rawCookie);
        var cookieHeaderValue = new CookieHeaderValue(cookie.Name, cookie.Value).ToString();

        return new LoggedUser(user.Email, user.Password, cookieHeaderValue);
    }

    public async Task<ProfessionalUser> CreateProfessional()
    {
        var loggedUser = await CreateLoggedUser();
        var unique = Guid.NewGuid().ToString("N")[..8];

        var dto = new CreateProfessionalDto
        {
            Username = $"johndoe_{unique}",
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
        response1.EnsureSuccessStatusCode();

        var request2 = new HttpRequestMessage(HttpMethod.Get, "/api/professionals/me");
        request2.Headers.Add("Cookie", loggedUser.Token);

        var response2 = await _client.SendAsync(request2);
        var professional = await response2.Content.ReadFromJsonAsync<Professional>();

        return new ProfessionalUser(loggedUser, professional!);
    }

    public async Task<ProfessionalUser> CreateProfessionalWithServicesAndAvailability()
    {
        var profile = await CreateProfessional();

        var availabilities = new List<CreateAvailabilityDto>()
        {
            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Monday,
                StartTime = new TimeOnly(9, 0, 0),
                EndTime = new TimeOnly(13, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Monday,
                StartTime = new TimeOnly(15, 0, 0),
                EndTime = new TimeOnly(19, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Tuesday,
                StartTime = new TimeOnly(9, 0, 0),
                EndTime = new TimeOnly(13, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Tuesday,
                StartTime = new TimeOnly(15, 0, 0),
                EndTime = new TimeOnly(19, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Wednesday,
                StartTime = new TimeOnly(9, 0, 0),
                EndTime = new TimeOnly(13, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Wednesday,
                StartTime = new TimeOnly(15, 0, 0),
                EndTime = new TimeOnly(19, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Thursday,
                StartTime = new TimeOnly(9, 0, 0),
                EndTime = new TimeOnly(13, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Thursday,
                StartTime = new TimeOnly(15, 0, 0),
                EndTime = new TimeOnly(19, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Friday,
                StartTime = new TimeOnly(9, 0, 0),
                EndTime = new TimeOnly(13, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Friday,
                StartTime = new TimeOnly(15, 0, 0),
                EndTime = new TimeOnly(19, 0, 0)
            },
        };

        var requestAvailabilities = new HttpRequestMessage(HttpMethod.Post, "/api/availabilities")
        {
            Content = JsonContent.Create(availabilities)
        };
        requestAvailabilities.Headers.Add("Cookie", profile.User.Token);

        await _client.SendAsync(requestAvailabilities);

        var services = new List<CreateServiceDto>()
        {
            new CreateServiceDto {
                Name = "Consultoria API",
                Description = "Especialista em backend.",
                Price = 150,
                DurationMinutes = 30,
            },

            new CreateServiceDto {
                Name = "Consultoria Banco de Dados",
                Description = "Especialista em SQL Server e Postgres.",
                Price = 200.99m,
                DurationMinutes = 60,
            },

            new CreateServiceDto {
                Name = "Consultoria Testes Automatizados",
                Description = "Especialista em xUnit e Testcontainers",
                Price = 397,
                DurationMinutes = 90,
            },
        };

        var requestServices = new HttpRequestMessage(HttpMethod.Post, "/api/services/batch")
        {
            Content = JsonContent.Create(services)
        };
        requestServices.Headers.Add("Cookie", profile.User.Token);

        await _client.SendAsync(requestServices);

        return profile;
    }
}

public record CreatedUser(string Email, string Password);
public record LoggedUser(string Email, string Password, string Token);
public record ProfessionalUser(LoggedUser User, Professional Professional);