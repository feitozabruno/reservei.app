using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reservei.Api.Models;

namespace Reservei.Api.Data.Configurations;

public class AvailabilityConfiguration : IEntityTypeConfiguration<Availability>
{
    public void Configure(EntityTypeBuilder<Availability> builder)
    {
        builder
            .HasKey(a => a.Id);

        builder
            .Property(a => a.ProfessionalId)
            .IsRequired();

        builder
            .HasOne(a => a.Professional)
            .WithMany(p => p.Availabilities)
            .HasForeignKey(a => a.ProfessionalId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasIndex(a => new { a.ProfessionalId, a.DayOfWeek });

        builder
            .ToTable(t => t.HasCheckConstraint(
                "CK_Availability_StartTime_EndTime",
                "[StartTime] < [EndTime]"
            ));
    }
}