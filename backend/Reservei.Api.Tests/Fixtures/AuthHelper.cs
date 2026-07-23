using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Auth;

namespace Reservei.Api.Tests.Fixtures;

public class AuthHelper(HttpClient client)
{
    private readonly HttpClient _client = client;
    private static string UniqueEmail() => $"test_{Guid.NewGuid()}@email.com";

    public async Task<CreatedUser> CreateUserAsync(
        string name = "John Doe",
        string email = "",
        string password = "JohnPassword")
    {
        if (string.IsNullOrEmpty(email)) email = UniqueEmail();

        var dto = new RegisterDto
        {
            FullName = name,
            Email = email,
            Password = password
        };

        await _client.PostAsJsonAsync("/api/auth/register", dto);

        return new CreatedUser(email, password);
    }
}

public record CreatedUser(string Email, string Password);