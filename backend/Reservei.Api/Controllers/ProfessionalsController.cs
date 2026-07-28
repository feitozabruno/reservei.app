using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.DTOs.Professional;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ProfessionalsController(IProfessionalService professionalService) : ControllerBase
{
    private readonly IProfessionalService _professionalService = professionalService;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProfessionalDto dto)
    {
        await _professionalService.CreateAsync(dto);
        return Created("", "Perfil profissional criado com sucesso.");
    }
}