using System;

namespace Reservei.Api.Models;

public class Availability
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Professional Professional { get; set; } = null!;
    public Guid ProfessionalId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}