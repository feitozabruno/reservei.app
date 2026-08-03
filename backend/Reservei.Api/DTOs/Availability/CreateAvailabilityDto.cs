using System;
using System.ComponentModel.DataAnnotations;

namespace Reservei.Api.DTOs.Availability;

public record CreateAvailabilityDto
{
    [Required(ErrorMessage = "O dia da semana é obrigatório.")]
    public required DayOfWeek DayOfWeek { get; set; }

    [Required(ErrorMessage = "O horário de ínicio é obrigatório.")]
    public required TimeOnly StartTime { get; set; }

    [Required(ErrorMessage = "O horário de término é obrigatório.")]
    public required TimeOnly EndTime { get; set; }
}