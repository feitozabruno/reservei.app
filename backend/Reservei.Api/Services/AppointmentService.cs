using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Appointment;
using Reservei.Api.Exceptions;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class AppointmentService(
    IAppointmentRepository appointmentRepository,
    IGuestRepository guestRepository,
    IServiceService serviceService,
    IProfessionalService professionalService,
    IEmailService emailService
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

        var service = await serviceService.GetByIdAsync(dto.ServiceId);

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

        string bodyHtml = $@"
            <h2>Agendamento Confirmado!</h2>
            <p>Olá, seu horário está marcado.</p>
            <p>Para eventual cancelamento, utilize esse link:</p>
            <a href='https://reservei.app/cancelar-agendamento?id={newAppointment.Id}&accessToken={newAppointment.AccessToken}'>Cancelar agendamento</a>
        ";

        await emailService.SendAsync(newGuest.Email, "Novo agendamento", bodyHtml);

        return newAppointment;
    }

    public async Task<List<Appointment>> GetByProfessionalAndDateRangeAsync(
        Guid professionalId, DateTimeOffset rangeStart, DateTimeOffset rangeEnd)
    {
        return await appointmentRepository.GetByProfessionalAndDateRangeAsync(professionalId, rangeStart, rangeEnd);
    }

    public async Task CancelByProfessionalAsync(Guid id)
    {
        Professional? currentProfessional = await professionalService.GetByUserIdAsync();
        if (currentProfessional is null) throw new NotFoundException("Perfil Profissional não encontrado para o usuário logado.");

        Appointment? appointment = await appointmentRepository.GetById(id);
        if (appointment is null) throw new NotFoundException("Nenhum agendamento com essa identificação foi encontrado.");

        if (currentProfessional.Id != appointment.ProfessionalId) throw new ValidationException("Esse agendamento não pertence a você.");

        appointment.Status = AppointmentStatus.CanceledByProfessional;
        await appointmentRepository.UpdateAsync(appointment);
    }

    public async Task CancelByClientAsync(Guid id, string accessToken)
    {
        Appointment? appointment = await appointmentRepository.GetById(id);

        if (appointment is null) throw new NotFoundException("Nenhum agendamento com essa identificação foi encontrado.");
        if (appointment.AccessToken != accessToken) throw new ValidationException("Token de acesso inválido");

        appointment.Status = AppointmentStatus.CanceledByClient;
        await appointmentRepository.UpdateAsync(appointment);
    }
}