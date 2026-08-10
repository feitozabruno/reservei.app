using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Reservei.Api.Data;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;

namespace Reservei.Api.Repositories;

public class ServiceRepository(AppDbContext context) : IServiceRepository
{
    public async Task AddAsync(Service service)
    {
        await context.AddAsync(service);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Service>> GetServicesByProfessionalIdAsync(Guid professionalId)
    {
        return await context.Services
            .Where(s => s.ProfessionalId == professionalId)
            .ToListAsync();
    }
}