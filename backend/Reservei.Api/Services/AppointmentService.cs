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



        var service = await serviceRepository.GetByIdAsync(dto.ServiceId);


        DateTimeOffset endTime = dto.StartTime.AddMinutes(service!.DurationMinutes);

        Appointment newAppointment = new Appointment
        {
            ProfessionalId = dto.ProfessionalId,
            ServiceId = dto.ServiceId,
            GuestId = newGuest.Id,
            StartTime = dto.StartTime,
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