using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Reservei.Api.Data;
using Reservei.Api.Exceptions;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;

namespace Reservei.Api.Repositories;

public class AvailabilityRepository(AppDbContext context) : IAvailabilityRepository
{
    public async Task<IEnumerable<Availability>> GetAllByProfessionalIdAsync(Guid professionalId)
    {
        return
            await context.Availabilities
                .Where(a => a.ProfessionalId == professionalId)
                .OrderBy(a => a.StartTime)
                .ToListAsync();
    }

    public async Task AddRangeAsync(IEnumerable<Availability> availabilities)
    {
        await context.Availabilities.AddRangeAsync(availabilities);
    }

    public void RemoveRange(IEnumerable<Availability> availabilities)
    {
        context.Availabilities.RemoveRange(availabilities);
    }

    public async Task SaveChangesAsync()
    {
        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new DatabaseException("Erro no banco ou na query");
        }
    }
}