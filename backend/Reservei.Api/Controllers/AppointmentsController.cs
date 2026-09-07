using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reservei.Api.DTOs.Appointment;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class AppointmentsController(IAppointmentService appointmentService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CreateAppointmentDto dto)
    {
        var newAppointment = await appointmentService.AddAsync(dto);
        return Created("", newAppointment);
    }

    [Authorize]
    [HttpPatch("{id}/cancel-by-professional")]
    public async Task<IActionResult> CancelByProfessional([FromRoute] Guid id)
    {
        await appointmentService.CancelByProfessionalAsync(id);
        return Ok("Agendamento cancelado");
    }


    [HttpPatch("{id}/cancel-by-client")]
    public async Task<IActionResult> CancelByClient([FromRoute] Guid id, [FromQuery(Name = "accessToken")] string accessToken)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            return BadRequest("O token de acesso é obrigatório para cancelar o agendamento.");
        }

        await appointmentService.CancelByClientAsync(id, accessToken);
        return Ok("Agendamento cancelado");
    }
}