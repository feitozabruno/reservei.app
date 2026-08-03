using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.DTOs.Availability;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class AvailabilitiesController(IAvailabilityService availabilityService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] List<CreateAvailabilityDto> dto)
    {
        await availabilityService.ReplaceWeeklyAvailabilitiesAsync(dto);
        return Created("", "Disponibilidade criada com sucesso.");
    }
}