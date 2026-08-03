using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Availability;
using Reservei.Api.Exceptions;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;
using Reservei.Api.Services.Interfaces;
using Reservei.Api.Services.Validators;

namespace Reservei.Api.Services;

public class AvailabilityService(
    IAvailabilityRepository availabilityRepository, IProfessionalService professionalService
) : IAvailabilityService
{
    public async Task ReplaceWeeklyAvailabilitiesAsync(List<CreateAvailabilityDto> dto)
    {
        Guid? professionalId = await professionalService.GetProfessionalIdByUserIdAsync();
        if (professionalId is null) throw new NotFoundException("Profissional não encontrado para o usuário logado.");

        List<Availability> newAvailabilities = dto
            .Select(availability => new Availability
            {
                ProfessionalId = professionalId.Value,
                DayOfWeek = availability.DayOfWeek,
                StartTime = availability.StartTime,
                EndTime = availability.EndTime,
            })
            .ToList();

        AvailabilityValidator.CheckForSelfOverlaps(newAvailabilities);

        IEnumerable<Availability> existingAvailabilities = await availabilityRepository.GetAllByProfessionalIdAsync(professionalId.Value);
        availabilityRepository.RemoveRange(existingAvailabilities);

        await availabilityRepository.AddRangeAsync(newAvailabilities);
        await availabilityRepository.SaveChangesAsync();
    }
}