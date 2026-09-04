using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.Models;

namespace Reservei.Api.Repositories.Interfaces;

public interface IAppointmentRepository
{
    Task AddAsync(Appointment appointment);
    Task<List<Appointment>> GetByProfessionalAndDateRangeAsync(
        Guid professionalId, DateTimeOffset rangeStart, DateTimeOffset rangeEnd
    );
    Task<Appointment?> GetById(Guid id);
    Task UpdateAsync(Appointment updatedAppointment);
}