using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Availability;
using Reservei.Api.Models;

namespace Reservei.Api.Services.Interfaces;

public interface IAvailabilityService
{
    Task ReplaceWeeklyAvailabilitiesAsync(List<CreateAvailabilityDto> dto);
    Task<IEnumerable<Availability>> GetAllByProfessionalIdAsync();
    Task<List<Availability>> GetByProfessionalAndDayOfWeekAsync(Guid professionalId, DayOfWeek dayOfWeek);
}