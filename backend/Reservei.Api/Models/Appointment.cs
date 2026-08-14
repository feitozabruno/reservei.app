using System;

namespace Reservei.Api.Models;

public class Appointment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Professional Professional { get; set; } = null!;
    public Guid ProfessionalId { get; set; }
    public Service Service { get; set; } = null!;
    public Guid ServiceId { get; set; }
    public Guest Guest { get; set; } = null!;
    public Guid GuestId { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string AccessToken { get; set; } = Guid.NewGuid().ToString("N");
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; }
}

public enum AppointmentStatus
{
    Pending,
    Scheduled,
    Cancelled,
    Completed,
    NoShow
}