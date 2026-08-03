using System.Collections.Generic;
using Reservei.Api.Exceptions;
using Reservei.Api.Models;

namespace Reservei.Api.Services.Validators;

public static class AvailabilityValidator
{
    public static void CheckForSelfOverlaps(IReadOnlyList<Availability> availabilities)
    {
        for (var i = 0; i < availabilities.Count; i++)
        {
            for (var j = i + 1; j < availabilities.Count; j++)
            {
                var a = availabilities[i];
                var b = availabilities[j];

                if (a.DayOfWeek == b.DayOfWeek &&
                    a.StartTime < b.StartTime &&
                    a.EndTime > b.StartTime)
                {
                    throw new ValidationException($"Os horários [{a.StartTime}-{a.EndTime}] e [{b.StartTime}-{b.EndTime}] para {a.DayOfWeek} se sobrepõem.");
                }
            }
        }
    }
}