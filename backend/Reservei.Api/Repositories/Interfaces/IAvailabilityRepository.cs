using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.Models;

namespace Reservei.Api.Repositories.Interfaces;

public interface IAvailabilityRepository
{
    Task<IEnumerable<Availability>> GetAllByProfessionalIdAsync(Guid professionalId);
    Task AddRangeAsync(IEnumerable<Availability> availabilities);
    void RemoveRange(IEnumerable<Availability> availabilities);
    Task SaveChangesAsync();
    Task<List<Availability>> GetByProfessionalAndDayOfWeekAsync(Guid professionalId, DayOfWeek dayOfWeek);
}