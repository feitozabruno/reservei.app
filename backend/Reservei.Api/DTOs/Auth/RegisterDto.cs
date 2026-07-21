using System.ComponentModel.DataAnnotations;

namespace Reservei.Api.DTOs.Auth;

public record RegisterDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    public required string FullName { get; init; }

    [Required(ErrorMessage = "O email é obrigatório.")]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public required string Email { get; init; }

    [Required(ErrorMessage = "A senha é obrigatória.")]
    public required string Password { get; init; }
};