using System;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Professional;
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
}