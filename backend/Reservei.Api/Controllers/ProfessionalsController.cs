using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.DTOs.Professional;
using Reservei.Api.Models;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ProfessionalsController(IProfessionalService professionalService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProfessionalDto dto)
    {
        await professionalService.CreateAsync(dto);
        return Created("", "Perfil profissional criado com sucesso.");
    }

    [HttpGet]
    [Route("me")]
    public async Task<IActionResult> Read()
    {
        Professional? professional = await professionalService.GetProfessionalByUserIdAsync();
        if (professional is null) return NotFound("Perfil profissional não encontrado.");
        return Ok(professional);
    }

    [HttpGet]
    [Route("{username}")]
    public async Task<IActionResult> Get(string username)
    {
        ProfessionalResponseDto? professional = await professionalService.GetByUsernameAsync(username);
        if (professional is null) return NotFound("Perfil profissional não encontrado.");
        return Ok(professional);
    }
}