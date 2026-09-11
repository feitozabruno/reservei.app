using System.ComponentModel.DataAnnotations;

namespace Reservei.Api.DTOs.Auth;

public record ChangePasswordDto
{
    public string Password { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}