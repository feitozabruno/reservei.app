using System;
using System.Collections.Generic;
using Reservei.Api.DTOs.Availability;
using Reservei.Api.DTOs.Service;

namespace Reservei.Api.DTOs.Professional;

public record ProfessionalResponseDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string AddressCep { get; set; } = string.Empty;
    public string AddressStreet { get; set; } = string.Empty;
    public string AddressNumber { get; set; } = string.Empty;
    public string AddressNeightborhood { get; set; } = string.Empty;
    public string AddressCity { get; set; } = string.Empty;
    public string AddressState { get; set; } = string.Empty;
    public string AddressComplement { get; set; } = string.Empty;
    public List<ServiceResponseDto> Services { get; set; } = null!;
    public List<AvailabilityResponseDto> Availabilities { get; set; } = null!;

    public static ProfessionalResponseDto From(Models.Professional professional)
    {
        return new ProfessionalResponseDto
        {
            Id = professional.Id,
            Username = professional.Username,
            FullName = professional.FullName,
            Specialty = professional.Specialty,
            BusinessName = professional.BusinessName,
            PhoneNumber = professional.PhoneNumber,
            Bio = professional.Bio,
            AddressCep = professional.AddressCep,
            AddressStreet = professional.AddressStreet,
            AddressNumber = professional.AddressNumber,
            AddressNeightborhood = professional.AddressNeightborhood,
            AddressComplement = professional.AddressComplement,
            AddressCity = professional.AddressCity,
            AddressState = professional.AddressState,
        };
    }
}