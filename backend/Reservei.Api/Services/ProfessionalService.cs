using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Professional;
using Reservei.Api.DTOs.Service;
using Reservei.Api.Helpers;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class ProfessionalService(ICurrentUserService currentUserService, IProfessionalRepository professionalRepository) : IProfessionalService
{
    public async Task CreateAsync(CreateProfessionalDto dto)
    {
        Professional newProfessional = new Professional
        {
            UserId = currentUserService.UserId,
            Username = dto.Username,
            FullName = dto.FullName,
            Specialty = dto.Specialty,
            BusinessName = dto.BusinessName,
            PhoneNumber = dto.PhoneNumber,
            Bio = dto.Bio,
            AddressCep = dto.AddressCep,
            AddressStreet = dto.AddressStreet,
            AddressNumber = dto.AddressNumber,
            AddressNeightborhood = dto.AddressNeightborhood,
            AddressCity = dto.AddressCity,
            AddressState = dto.AddressState,
            AddressComplement = dto.AddressComplement,
            Timezone = BrazilTimezoneMapper.GetTimezone(dto.AddressState)
        };

        await professionalRepository.AddAsync(newProfessional);
    }

    public async Task<Professional?> GetProfessionalByUserIdAsync()
    {
        return await professionalRepository.GetProfessionalByUserIdAsync(currentUserService.UserId);
    }

    public async Task<Professional?> GetByIdAsync(Guid professionalId)
    {
        return await professionalRepository.GetByIdAsync(professionalId);
    }

    public async Task<ProfessionalResponseDto?> GetByUsernameAsync(string username)
    {
        Professional? professional = await professionalRepository.GetByUsernameAsync(username);
        if (professional is null) return null;

        List<ServiceResponseDto> services = professional.Services
            .Select(service => new ServiceResponseDto
            {
                Id = service.Id,
                ProfessionalId = service.ProfessionalId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                DurationMinutes = service.DurationMinutes
            })
            .ToList();

        var dto = new ProfessionalResponseDto
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
            AddressCity = professional.AddressCity,
            AddressState = professional.AddressState,
            AddressComplement = professional.AddressComplement,
            Services = services
        };

        return dto;
    }
}