using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Reservei.Api.Data.Configurations;
using Reservei.Api.Models;

namespace Reservei.Api.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Professional> Professionals { get; set; } = null!;
    public DbSet<Availability> Availabilities { get; set; } = null!;
    public DbSet<Service> Services { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new ProfessionalConfiguration());
        modelBuilder.ApplyConfiguration(new AvailabilityConfiguration());
        modelBuilder.ApplyConfiguration(new ServiceConfiguration());
    }
}