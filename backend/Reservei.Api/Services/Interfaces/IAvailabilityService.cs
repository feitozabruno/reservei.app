using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Availability;

namespace Reservei.Api.Services.Interfaces;

public interface IAvailabilityService
{
    Task ReplaceWeeklyAvailabilitiesAsync(List<CreateAvailabilityDto> dto);
}