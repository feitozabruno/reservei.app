using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Appointment;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class AppointmentService(
    IAppointmentRepository appointmentRepository,
    IGuestRepository guestRepository,
    IServiceRepository serviceRepository
    ) : IAppointmentService
{
    public async Task<Appointment> AddAsync(CreateAppointmentDto dto)
    {
        Guest newGuest = new Guest
        {
            Name = dto.ClientName,
            Email = dto.ClientEmail,
            Phone = dto.ClientPhone
        };

        await guestRepository.AddAsync(newGuest);

        var hours = dto.StartTime.Hour;
        var minutes = dto.StartTime.Minute;
        var day = dto.DateSchedule.Day;
        var month = dto.DateSchedule.Month;
        var year = dto.DateSchedule.Year;

        var service = await serviceRepository.GetByIdAsync(dto.ServiceId);

        DateTimeOffset startTime = new DateTimeOffset(year, month, day, hours, minutes, 0, new TimeSpan(0, 0, 0));
        DateTimeOffset endTime = startTime.AddMinutes(service!.DurationMinutes);

        Appointment newAppointment = new Appointment
        {
            ProfessionalId = dto.ProfessionalId,
            ServiceId = dto.ServiceId,
            GuestId = newGuest.Id,
            StartTime = startTime,
            EndTime = endTime
        };

        await appointmentRepository.AddAsync(newAppointment);

        return newAppointment;
    }

    public async Task<List<Appointment>> GetByProfessionalAndDateRangeAsync(
        Guid professionalId, DateTimeOffset rangeStart, DateTimeOffset rangeEnd)
    {
        return await appointmentRepository.GetByProfessionalAndDateRangeAsync(professionalId, rangeStart, rangeEnd);
    }
}