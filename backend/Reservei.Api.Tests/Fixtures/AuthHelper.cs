using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Net.Http.Headers;
using Reservei.Api.DTOs.Auth;

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
}

public record CreatedUser(string Email, string Password);
public record LoggedUser(string Email, string Password, string Token);