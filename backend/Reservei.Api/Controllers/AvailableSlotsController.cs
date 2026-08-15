using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.Services;

namespace Reservei.Api.Controllers;

[ApiController]
[Route("api/professionals/{professionalId:guid}/available-slots")]
public class AvailableSlotsController(AvailableSlotsService availableSlotsService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TimeSlotDto>>> GetAvailableSlots(
        Guid professionalId,
        [FromQuery] Guid serviceId,
        [FromQuery] DateOnly date)
    {
        // Impede consultar slots de datas no passado — não faz sentido pro cliente
        // agendar "ontem", e evita processar um cálculo inteiro pra devolver lista vazia.
        if (date < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return BadRequest("A data não pode estar no passado.");
        }

        var slots = await availableSlotsService.GetAvailableSlotsAsync(
            professionalId, serviceId, date);

        return Ok(slots);
    }
}