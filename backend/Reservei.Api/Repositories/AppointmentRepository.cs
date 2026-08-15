using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Reservei.Api.Data;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;

namespace Reservei.Api.Repositories;

public class AppointmentRepository(AppDbContext context) : IAppointmentRepository
{
    public async Task AddAsync(Appointment appointment)
    {
        await context.AddAsync(appointment);
        await context.SaveChangesAsync();
    }

    public async Task<List<Appointment>> GetByProfessionalAndDateRangeAsync(
        Guid professionalId, DateTimeOffset rangeStart, DateTimeOffset rangeEnd)
    {
        return await context.Appointments
            .Where(a => a.ProfessionalId == professionalId
                && a.StartTime >= rangeStart
                && a.StartTime < rangeEnd)
            .OrderBy(a => a.StartTime)
            .AsNoTracking()
            .ToListAsync();
    }
}