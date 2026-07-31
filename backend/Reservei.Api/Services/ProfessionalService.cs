using System.Threading.Tasks;
using Reservei.Api.DTOs.Professional;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class ProfessionalService(ICurrentUserService currentUserService, IProfessionalRepository professionalRepository) : IProfessionalService
{
    private readonly ICurrentUserService _currentUserService = currentUserService;
    private readonly IProfessionalRepository _professionalRepository = professionalRepository;

    public async Task CreateAsync(CreateProfessionalDto dto)
    {
        Professional newProfessional = new Professional
        {
            UserId = _currentUserService.UserId,
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
            AddressComplement = dto.AddressComplement
        };

        await _professionalRepository.AddAsync(newProfessional);
    }
}