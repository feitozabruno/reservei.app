using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reservei.Api.Models;

namespace Reservei.Api.Data.Configurations;

public class ProfessionalConfiguration : IEntityTypeConfiguration<Professional>
{
    public void Configure(EntityTypeBuilder<Professional> builder)
    {
        builder.HasOne(p => p.User)
            .WithOne(u => u.Professional)
            .HasForeignKey<Professional>(p => p.UserId)
            .IsRequired();

        builder.Property(p => p.Username)
            .UseCollation("SQL_Latin1_General_CP1_CI_AS");

        builder.HasIndex(p => p.Username)
            .IsUnique();

        builder.Property(p => p.Timezone)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.AddressState)
            .HasMaxLength(2)
            .IsRequired();
    }
}