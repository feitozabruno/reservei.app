using System;
using System.Threading.Tasks;
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

    [HttpPatch]
    [Route("{id}/cancel")]
    public async Task<IActionResult> CancelByProfessional([FromRoute] Guid id)
    {
        await appointmentService.CancelByProfessionalAsync(id);
        return Ok("Agendamento cancelado");
    }
}