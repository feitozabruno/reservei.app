using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;
using Reservei.Api.DTOs.Auth;
using Reservei.Api.DTOs.Professional;
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
}

public record CreatedUser(string Email, string Password);
public record LoggedUser(string Email, string Password, string Token);
public record ProfessionalUser(LoggedUser User, Professional Professional);