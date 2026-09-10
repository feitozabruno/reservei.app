using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        Professional? professional = await professionalService.GetByUserIdAsync();
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

    [Authorize]
    [HttpPatch("me/photo")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("Nenhum arquivo enviado");
        await professionalService.UpdateProfilePhotoAsync(file);
        return Ok("Imagem atualizada com sucesso.");
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var result = await professionalService.GetAllPagedAsync(page, pageSize);

        return Ok(result);
    }
}