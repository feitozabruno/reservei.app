using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Reservei.Api.Models;

namespace Reservei.Api.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Professional> Professionals { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Professional>()
            .HasOne(p => p.User)
            .WithOne(u => u.Professional)
            .HasForeignKey<Professional>(p => p.UserId)
            .IsRequired();

        modelBuilder.Entity<Professional>()
            .Property(p => p.Username)
            .UseCollation("SQL_Latin1_General_CP1_CI_AS");

        modelBuilder.Entity<Professional>()
            .HasIndex(p => p.Username)
            .IsUnique();
    }
}