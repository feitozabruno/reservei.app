using System.ComponentModel.DataAnnotations;

namespace Reservei.Api.DTOs.Professional;

public record CreateProfessionalDto
{
    [Required(ErrorMessage = "O nome de usuário é obrigatório.")]
    [MinLength(3, ErrorMessage = "O nome de usuário deve ter no mínimo 3 caracteres.")]
    [MaxLength(30, ErrorMessage = "O nome de usuário deve ter no máximo 30 caracteres.")]
    public required string Username { get; set; }

    [Required(ErrorMessage = "O nome de exibição é obrigatório.")]
    [MinLength(3, ErrorMessage = "O nome deve ter no mínimo 3 caracteres.")]
    [MaxLength(50, ErrorMessage = "O nome deve ter no máximo 50 caracteres.")]
    public required string FullName { get; set; }

    [Required(ErrorMessage = "A especialidade é obrigatória.")]
    [MinLength(3, ErrorMessage = "A especialidade deve ter no mínimo 3 caracteres.")]
    [MaxLength(50, ErrorMessage = "A especialidade deve ter no máximo 50 caracteres.")]
    public required string Specialty { get; set; }

    [MaxLength(50, ErrorMessage = "O nome do negócio deve ter no máximo 50 caracteres.")]
    public string BusinessName { get; set; } = string.Empty;

    [Required(ErrorMessage = "O telefone é obrigatório.")]
    [Phone(ErrorMessage = "Telefone inválido.")]
    public required string PhoneNumber { get; set; }

    [MaxLength(300, ErrorMessage = "A bio deve ter no máximo 300 caracteres.")]
    public string Bio { get; set; } = string.Empty;

    [Required(ErrorMessage = "O CEP é obrigatório.")]
    [RegularExpression(@"^\d{5}-?\d{3}$", ErrorMessage = "CEP inválido.")]
    public required string AddressCep { get; set; }

    [Required(ErrorMessage = "A rua é obrigatória.")]
    public required string AddressStreet { get; set; }

    [Required(ErrorMessage = "O número é obrigatório.")]
    public required string AddressNumber { get; set; }

    [Required(ErrorMessage = "O bairro é obrigatório.")]
    public required string AddressNeightborhood { get; set; }

    [Required(ErrorMessage = "A cidade é obrigatória.")]
    public required string AddressCity { get; set; }

    [Required(ErrorMessage = "O estado é obrigatório.")]
    [MaxLength(2, ErrorMessage = "Use a sigla do estado (ex: SP).")]
    public required string AddressState { get; set; }

    [MaxLength(100, ErrorMessage = "O complemento deve ter no máximo 100 caracteres.")]
    public string AddressComplement { get; set; } = string.Empty;
}