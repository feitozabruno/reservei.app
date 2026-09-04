using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Appointment;
using Reservei.Api.Models;

namespace Reservei.Api.Services.Interfaces;

public interface IAppointmentService
{
    Task<Appointment> AddAsync(CreateAppointmentDto dto);
    Task<List<Appointment>> GetByProfessionalAndDateRangeAsync(
        Guid professionalId, DateTimeOffset rangeStart, DateTimeOffset rangeEnd
    );
    Task CancelByProfessionalAsync(Guid id);
}