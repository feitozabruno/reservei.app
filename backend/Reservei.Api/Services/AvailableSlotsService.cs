using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class AvailableSlotsService(
    IProfessionalService professionalService,
    IServiceService serviceService,
    IAvailabilityService availabilityService,
    IAppointmentRepository appointmentRepository)
{
    // Tamanho do "passo" do grid de horários, alinhado ao relógio (:00, :15, :30, :45).
    // Decisão registrada: grid fixo, não elástico recalculado a partir do fim de cada agendamento.
    private const int GridIntervalMinutes = 15;

    public async Task<List<TimeSlotDto>> GetAvailableSlotsAsync(
        Guid professionalId, Guid serviceId, DateOnly date)
    {
        var professional = await professionalService.GetByIdAsync(professionalId);
        var service = await serviceService.GetByIdAsync(serviceId);

        // Janelas de disponibilidade recorrente do profissional pro dia da semana da data pedida.
        // Ex: se `date` cai numa terça-feira, busca as janelas cadastradas pra DayOfWeek.Tuesday.
        var dayAvailabilities = await availabilityService
            .GetByProfessionalAndDayOfWeekAsync(professionalId, date.DayOfWeek);

        // Sem nenhuma janela cadastrada pra esse dia da semana, não há nada a calcular.
        if (dayAvailabilities.Count == 0)
        {
            return [];
        }

        // "date" é um dia no calendário do profissional (timezone dele), não em UTC.
        // Convertemos os limites desse dia local pra um range absoluto em UTC,
        // porque é assim que `Appointment.StartTime` está armazenado no banco.
        var (rangeStart, rangeEnd) = GetUtcDayRange(date, professional!.Timezone);

        // Busca só os agendamentos que já existem dentro desse range —
        // são eles que vão "furar" as janelas de disponibilidade.
        var existingAppointments = await appointmentRepository
            .GetByProfessionalAndDateRangeAsync(professionalId, rangeStart, rangeEnd);

        // Availability (janelas) - Appointments (ocupações) = intervalos realmente livres.
        var freeIntervals = CalculateFreeIntervals(
            dayAvailabilities, existingAppointments, professional!.Timezone);

        // Dentro de cada intervalo livre, gera os horários de início possíveis
        // pro serviço escolhido, respeitando o grid fixo de 15min.
        var candidates = GenerateSlotCandidates(
            freeIntervals, service!.DurationMinutes, date, professional!.Timezone);

        // Se `date` for hoje (no timezone do profissional), remove os horários que já passaram.
        var validCandidates = FilterPastSlots(candidates, professional!.Timezone, date);

        return validCandidates.Select(c => new TimeSlotDto(c)).ToList();
    }

    // Converte o início e o fim do dia local do profissional (00h00 até 00h00 do dia seguinte,
    // no timezone dele) para instantes absolutos em UTC.
    //
    // Isso é necessário porque "dia 15/08" só existe em relação a um timezone: o mesmo instante em
    // UTC cai em dias diferentes dependendo de onde você está. Convertendo aqui, o resto do código
    // (e o Repository) trabalha só com instantes absolutos, sem precisar saber que timezone existe.
    private static (DateTimeOffset RangeStart, DateTimeOffset RangeEnd) GetUtcDayRange(
        DateOnly date, string timezoneId)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);

        // DateTime "Unspecified" representa um horário de relógio sem timezone embutido —
        // é isso que ConvertTimeToUtc espera: "essa hora, nesse timezone, converte pra UTC".
        var localMidnightToday = DateTime.SpecifyKind(
            date.ToDateTime(TimeOnly.MinValue), DateTimeKind.Unspecified);
        var localMidnightTomorrow = DateTime.SpecifyKind(
            date.AddDays(1).ToDateTime(TimeOnly.MinValue), DateTimeKind.Unspecified);

        var rangeStart = TimeZoneInfo.ConvertTimeToUtc(localMidnightToday, timeZone);
        var rangeEnd = TimeZoneInfo.ConvertTimeToUtc(localMidnightTomorrow, timeZone);

        return (new DateTimeOffset(rangeStart, TimeSpan.Zero),
                new DateTimeOffset(rangeEnd, TimeSpan.Zero));
    }

    // Subtrai os appointments existentes das janelas de Availability, produzindo os
    // intervalos onde não há absolutamente nada ocupando o tempo do profissional.
    //
    // Trabalha em TimeOnly (hora local do profissional), porque Availability já é
    // armazenada assim (recorrência semanal não tem timezone própria — ela "herda"
    // o timezone do profissional no momento em que é aplicada a uma data específica).
    private static List<FreeInterval> CalculateFreeIntervals(
        List<Availability> dayAvailabilities,
        List<Appointment> existingAppointments,
        string timezoneId)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);

        // Converte cada appointment (UTC) pra um intervalo TimeOnly local,
        // pra poder comparar diretamente com as janelas de Availability.
        var occupiedIntervals = existingAppointments
            .Select(a => new FreeInterval(
                TimeOnly.FromDateTime(TimeZoneInfo.ConvertTime(a.StartTime, timeZone).DateTime),
                TimeOnly.FromDateTime(TimeZoneInfo.ConvertTime(a.EndTime, timeZone).DateTime)))
            .OrderBy(i => i.Start)
            .ToList();

        var freeIntervals = new List<FreeInterval>();

        foreach (var window in dayAvailabilities)
        {
            // Começa assumindo a janela inteira como livre, e vai "mordendo" pedaços
            // dela conforme encontra appointments que se sobrepõem.
            var remaining = new List<FreeInterval> { new(window.StartTime, window.EndTime) };

            foreach (var occupied in occupiedIntervals)
            {
                var next = new List<FreeInterval>();

                foreach (var free in remaining)
                {
                    // Sem sobreposição: o ocupado está totalmente fora desse pedaço livre,
                    // então o pedaço livre continua inteiro.
                    if (occupied.End <= free.Start || occupied.Start >= free.End)
                    {
                        next.Add(free);
                        continue;
                    }

                    // Sobra livre ANTES do início do ocupado.
                    if (occupied.Start > free.Start)
                    {
                        next.Add(new FreeInterval(free.Start, occupied.Start));
                    }

                    // Sobra livre DEPOIS do fim do ocupado.
                    if (occupied.End < free.End)
                    {
                        next.Add(new FreeInterval(occupied.End, free.End));
                    }

                    // Se nenhuma das duas condições acima bateu, o ocupado cobre o
                    // pedaço livre inteiro — nada sobra, e não adicionamos nada.
                }

                remaining = next;
            }

            freeIntervals.AddRange(remaining);
        }

        return freeIntervals.OrderBy(i => i.Start).ToList();
    }

    // Gera os horários de início candidatos dentro de cada intervalo livre, alinhados
    // ao grid fixo do relógio (:00/:15/:30/:45) — nunca relativos ao início do intervalo.
    //
    // Um candidato só é válido se o serviço COMEÇANDO ali termina antes (ou exatamente)
    // do fim do intervalo livre — senão o serviço invadiria um agendamento existente
    // ou o fim da janela de disponibilidade.
    private static List<DateTimeOffset> GenerateSlotCandidates(
        List<FreeInterval> freeIntervals,
        int serviceDurationMinutes,
        DateOnly date,
        string timezoneId)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
        var duration = TimeSpan.FromMinutes(serviceDurationMinutes);
        var candidates = new List<DateTimeOffset>();

        foreach (var interval in freeIntervals)
        {
            // O primeiro candidato não é necessariamente o início do intervalo —
            // é o primeiro ponto do grid (:00/:15/:30/:45) igual ou depois dele.
            var current = RoundUpToGrid(interval.Start, GridIntervalMinutes);

            while (current.Add(duration) <= interval.End)
            {
                // Converte o horário local (TimeOnly) de volta pra um instante absoluto,
                // combinando com a data pedida e o timezone do profissional.
                var localDateTime = DateTime.SpecifyKind(date.ToDateTime(current), DateTimeKind.Unspecified);
                var utcDateTime = TimeZoneInfo.ConvertTimeToUtc(localDateTime, timeZone);
                candidates.Add(new DateTimeOffset(utcDateTime, TimeSpan.Zero));

                var next = current.Add(TimeSpan.FromMinutes(GridIntervalMinutes));

                // TimeOnly "vira o relógio" ao ultrapassar 24h (23:50 + 15min = 00:05),
                // o que indicaria virada de dia — como Availability não cruza meia-noite,
                // isso sinaliza que chegamos ao fim do intervalo.
                if (next < current)
                {
                    break;
                }

                current = next;
            }
        }

        return candidates;
    }

    // Arredonda um horário PRA CIMA até o próximo múltiplo do grid (ex: 15min: :00/:15/:30/:45).
    // Se o horário já cair exatamente num múltiplo, ele é mantido como está.
    private static TimeOnly RoundUpToGrid(TimeOnly time, int gridMinutes)
    {
        var totalMinutes = time.Hour * 60 + time.Minute;
        var remainder = totalMinutes % gridMinutes;

        if (remainder == 0)
        {
            return new TimeOnly(time.Hour, time.Minute);
        }

        var roundedMinutes = totalMinutes + (gridMinutes - remainder);
        return new TimeOnly(roundedMinutes / 60 % 24, roundedMinutes % 60);
    }

    // Remove candidatos que já ficaram no passado — só relevante quando `date` é o dia de hoje
    // no timezone do profissional. Pra qualquer data futura, nenhum candidato é descartado aqui.
    private static List<DateTimeOffset> FilterPastSlots(
        List<DateTimeOffset> candidates, string timezoneId, DateOnly date)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
        var nowLocal = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var todayLocal = DateOnly.FromDateTime(nowLocal.DateTime);

        if (date != todayLocal)
        {
            return candidates;
        }

        return candidates.Where(c => c > DateTimeOffset.UtcNow).ToList();
    }
}

public record FreeInterval(TimeOnly Start, TimeOnly End);

public record TimeSlotDto(DateTimeOffset StartTime);