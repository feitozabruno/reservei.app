using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reservei.Api.Models;

namespace Reservei.Api.Data.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Description)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(s => s.Price)
            .HasColumnType("decimal(10, 2)");

        builder.HasOne(s => s.Professional)
            .WithMany(p => p.Services)
            .HasForeignKey(s => s.ProfessionalId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(s => s.ProfessionalId);
    }
}