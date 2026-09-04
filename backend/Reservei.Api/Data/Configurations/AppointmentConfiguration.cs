using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reservei.Api.Models;

namespace Reservei.Api.Data.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder
            .HasOne(a => a.Professional)
            .WithMany()
            .HasForeignKey(a => a.ProfessionalId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(a => a.Service)
            .WithMany()
            .HasForeignKey(a => a.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(a => a.Guest)
            .WithOne()
            .HasForeignKey<Appointment>(a => a.GuestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasIndex(a => a.AccessToken)
            .IsUnique();

        builder
            .HasIndex(a => new { a.ProfessionalId, a.StartTime });

        builder
            .ToTable(t => t.HasCheckConstraint(
                "CK_Appointment_StartTime_EndTime",
                "[StartTime] < [EndTime]"
            ));

        builder
            .Property(a => a.Status)
            .HasConversion<string>();
    }
}