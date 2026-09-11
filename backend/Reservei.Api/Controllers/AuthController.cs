using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.DTOs.Auth;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        await authService.CreateUserAsync(dto);
        return Ok("Usuário criado com sucesso.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        string token = await authService.LoginUserAsync(dto);

        Response.Cookies.Append("jwt", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(30)
        });

        return Ok("Login efetuado com sucesso.");
    }

    [Authorize]
    [HttpPatch("email")]
    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailDto dto)
    {
        await authService.ChangeEmailAsync(dto);
        return Ok("Email alterado com sucesso");
    }

    [Authorize]
    [HttpPatch("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        await authService.ChangePasswordAsync(dto);
        return Ok("Senha alterada com sucesso");
    }
}