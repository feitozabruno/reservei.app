using System;

namespace Reservei.Api.DTOs.Service;

public record ServiceResponseDto
{
    public Guid Id { get; set; }
    public Guid ProfessionalId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationMinutes { get; set; }
}