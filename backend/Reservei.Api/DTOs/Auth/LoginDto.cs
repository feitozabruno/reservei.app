using System.ComponentModel.DataAnnotations;

namespace Reservei.Api.DTOs.Auth;

public record LoginDto
{
    [Required(ErrorMessage = "O email é obrigatório.")]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public required string Email { get; init; }

    [Required(ErrorMessage = "A senha é obrigatória.")]
    public required string Password { get; init; }
};