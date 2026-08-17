using System;
using System.ComponentModel.DataAnnotations;

namespace Reservei.Api.DTOs.Appointment;

public record CreateAppointmentDto
{
    [Required(ErrorMessage = "O ID do profissional é obrigatório.")]
    public Guid ProfessionalId { get; set; }

    [Required(ErrorMessage = "O ID do serviço é obrigatório.")]
    public Guid ServiceId { get; set; }

    [Required(ErrorMessage = "O nome do cliente é obrigatório.")]
    public string ClientName { get; set; } = string.Empty;

    [Required(ErrorMessage = "O email do cliente é obrigatório.")]
    public string ClientEmail { get; set; } = string.Empty;

    [Required(ErrorMessage = "O telefone do cliente é obrigatório.")]
    public string ClientPhone { get; set; } = string.Empty;

    [Required(ErrorMessage = "O horário de ínicio é obrigatório.")]
    public TimeOnly StartTime { get; set; }

    [Required(ErrorMessage = "O dia do agendamento é obrigatório.")]
    public DateOnly DateSchedule { get; set; }
}