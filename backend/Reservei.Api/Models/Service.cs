using System;

namespace Reservei.Api.Models;

public class Service
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Professional Professional { get; set; } = null!;
    public Guid ProfessionalId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
}