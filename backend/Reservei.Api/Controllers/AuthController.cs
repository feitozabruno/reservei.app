using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.DTOs.Auth;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        await _authService.CreateUserAsync(dto);
        return Ok("Usuário criado com sucesso.");
    }
}