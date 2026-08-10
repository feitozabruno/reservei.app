using System;
using System.ComponentModel.DataAnnotations;

namespace Reservei.Api.DTOs.Service;

public record CreateServiceDto
{
    [Required(ErrorMessage = "O nome do serviço é obrigatório.")]
    public required string Name { get; set; }

    [Required(ErrorMessage = "O preço do serviço é obrigatório.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O preço não pode ser zero ou negativo.")]
    public required decimal Price { get; set; }

    [Required(ErrorMessage = "A duração do serviço é obrigatório.")]
    [Range(5, 480, ErrorMessage = "O intervalo de duração deve estar entre 5 e 480 minutos.")]
    public required int DurationMinutes { get; set; }

    public string Description { get; set; } = string.Empty;
}