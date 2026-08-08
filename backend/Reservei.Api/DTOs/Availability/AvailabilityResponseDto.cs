using System;

namespace Reservei.Api.DTOs.Availability;

public record AvailabilityResponseDto
{
    public Guid Id { get; set; }
    public Guid ProfessionalId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}