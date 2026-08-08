using System.Collections.Generic;
using System.Linq;
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

    [HttpGet]
    [Route("me")]
    public async Task<IActionResult> Read()
    {
        var availabilities = await availabilityService.GetAllByProfessionalIdAsync();

        IEnumerable<AvailabilityResponseDto> dto = availabilities.Select(a => new AvailabilityResponseDto
        {
            Id = a.Id,
            ProfessionalId = a.ProfessionalId,
            DayOfWeek = a.DayOfWeek,
            StartTime = a.StartTime,
            EndTime = a.EndTime
        });

        return Ok(dto);
    }
}