using System.ComponentModel.DataAnnotations;

namespace Reservei.Api.DTOs.Auth;

public record ChangeEmailDto
{
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public string Email { get; set; } = string.Empty;
}