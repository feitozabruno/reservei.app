using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.DTOs.Auth;
using Reservei.Api.Tests.Fixtures;

namespace Reservei.Api.Tests.Integration;

public class AuthTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly AuthHelper _auth;
    private static string UniqueEmail() => $"test_{Guid.NewGuid()}@email.com";

    public AuthTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _auth = new AuthHelper(_client);
    }

    [Fact]
    public async Task Register_WithValidData_ReturnOk()
    {
        var dto = new RegisterDto
        {
            FullName = "John Doe",
            Email = UniqueEmail(),
            Password = "JohnPassword"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        body.Should().Be("Usuário criado com sucesso.");
    }

    [Fact]
    public async Task Register_WithInvalidEmailFormat_ReturnBadRequest()
    {
        var dto = new RegisterDto
        {
            FullName = "Invalid Email",
            Email = "invalidemail",
            Password = "ValidPassword"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);
        var body = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        body!.Title.Should().Be("Erro de validação");
        body!.Status.Should().Be(400);
        body!.Instance.Should().Be("/api/auth/register");
        body!.Errors.Should().ContainKey("Email");
        body!.Errors["Email"].Should().Contain("Email inválido.");
    }

    [Fact]
    public async Task Register_WithDuplicatedEmail_ReturnBadRequest()
    {
        var email = UniqueEmail();

        var dto = new RegisterDto
        {
            FullName = "John Doe",
            Email = email,
            Password = "JohnPassword"
        };

        await _client.PostAsJsonAsync("/api/auth/register", dto);

        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);
        var body = await response.Content.ReadFromJsonAsync<ProblemDetailsResponse>();

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        body!.Title.Should().Be("Erro de validação");
        body!.Status.Should().Be(400);
        body!.Detail.Should().Be("Esse email já está em uso.");
        body!.Instance.Should().Be("/api/auth/register");
    }

    [Fact]
    public async Task Register_WithWeakPassword_ReturnBadRequest()
    {
        var dto = new RegisterDto
        {
            FullName = "John Doe",
            Email = UniqueEmail(),
            Password = "Senha"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);
        var body = await response.Content.ReadFromJsonAsync<ProblemDetailsResponse>();

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        body!.Title.Should().Be("Erro de validação");
        body!.Status.Should().Be(400);
        body!.Detail.Should().Be("Passwords must be at least 6 characters.");
        body!.Instance.Should().Be("/api/auth/register");
    }

    [Fact]
    public async Task Login_WithValidData_ReturnOk()
    {
        var user = await _auth.CreateUserAsync();
        var dto = new LoginDto { Email = user.Email, Password = user.Password };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);
        var body = await response.Content.ReadAsStringAsync();

        response.Headers.Should().ContainKey("Set-Cookie");
        var cookies = response.Headers.GetValues("Set-Cookie");
        cookies.Should().Contain(c => c.StartsWith("jwt"));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        body.Should().Be("Login efetuado com sucesso.");
    }

    [Fact]
    public async Task Login_WithInvalidPassword_ReturnBadRequest()
    {
        var user = await _auth.CreateUserAsync();
        var dto = new LoginDto { Email = user.Email, Password = "InvalidPass" };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);
        var body = await response.Content.ReadFromJsonAsync<ProblemDetailsResponse>();

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        body!.Title.Should().Be("Erro de validação");
        body!.Status.Should().Be(400);
        body!.Detail.Should().Be("Email ou senha inválidos.");
        body!.Instance.Should().Be("/api/auth/login");
    }

    [Fact]
    public async Task Login_WithInvalidEmail_ReturnBadRequest()
    {
        var dto = new LoginDto { Email = "invalid@email.com", Password = "InvalidPass" };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);
        var body = await response.Content.ReadFromJsonAsync<ProblemDetailsResponse>();

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        body!.Title.Should().Be("Erro de validação");
        body!.Status.Should().Be(400);
        body!.Detail.Should().Be("Email ou senha inválidos.");
        body!.Instance.Should().Be("/api/auth/login");
    }

    [Fact]
    public async Task Login_WithInvalidEmailFormat_ReturnBadRequest()
    {
        var dto = new LoginDto { Email = "invalidemail", Password = "ValidPassword" };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);
        var body = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        body!.Title.Should().Be("Erro de validação");
        body!.Status.Should().Be(400);
        body!.Instance.Should().Be("/api/auth/login");
        body!.Errors.Should().ContainKey("Email");
        body!.Errors["Email"].Should().Contain("Email inválido.");
    }
}