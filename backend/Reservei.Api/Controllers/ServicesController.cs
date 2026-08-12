using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.DTOs.Service;
using Reservei.Api.Models;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ServicesController(IServiceService serviceService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceDto dto)
    {
        await serviceService.CreateAsync(dto);
        return Created("", "Serviço criado com sucesso.");
    }

    [HttpPost]
    [Route("batch")]
    public async Task<IActionResult> CreateMany([FromBody] List<CreateServiceDto> dto)
    {
        await serviceService.CreateRangeAsync(dto);
        return Created("", "Serviços criados com sucesso.");
    }

    [HttpGet]
    [Route("me")]
    public async Task<IActionResult> Read()
    {
        IEnumerable<Service> services = await serviceService.GetServicesByProfessionalIdAsync();

        IEnumerable<ServiceResponseDto> dto = services.Select(s => new ServiceResponseDto
        {
            Id = s.Id,
            ProfessionalId = s.ProfessionalId,
            Name = s.Name,
            Description = s.Description,
            Price = s.Price,
            DurationMinutes = s.DurationMinutes
        });

        return Ok(dto);
    }
}