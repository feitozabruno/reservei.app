using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Reservei.Api.Data;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;

namespace Reservei.Api.Repositories;

public class AppointmentRepository(AppDbContext db) : IAppointmentRepository
{
    public async Task AddAsync(Appointment appointment)
    {
        await db.AddAsync(appointment);
        await db.SaveChangesAsync();
    }

    public async Task<List<Appointment>> GetByProfessionalAndDateRangeAsync(
        Guid professionalId, DateTimeOffset rangeStart, DateTimeOffset rangeEnd)
    {
        return await db.Appointments
            .Where(a => a.ProfessionalId == professionalId
                && a.StartTime >= rangeStart
                && a.StartTime < rangeEnd
                && a.Status == AppointmentStatus.Scheduled)
            .OrderBy(a => a.StartTime)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Appointment?> GetById(Guid id)
    {
        return await db.Appointments
            .Where(a => a.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(Appointment updatedAppointment)
    {
        db.Appointments.Update(updatedAppointment);
        await db.SaveChangesAsync();
    }
}