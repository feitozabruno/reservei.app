using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Reservei.Api.Data;
using Reservei.Api.Repositories;
using Reservei.Api.Repositories.Interfaces;
using Reservei.Api.Services;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IProfessionalRepository, ProfessionalRepository>();
        services.AddScoped<IProfessionalService, ProfessionalService>();
        services.AddScoped<IAvailabilityRepository, AvailabilityRepository>();
        services.AddScoped<IAvailabilityService, AvailabilityService>();
        services.AddScoped<IServiceRepository, ServiceRepository>();
        services.AddScoped<IServiceService, ServiceService>();
        services.AddScoped<IGuestRepository, GuestRepository>();
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();
        services.AddScoped<IAppointmentService, AppointmentService>();
        services.AddScoped<AvailableSlotsService>();
        services.AddHttpContextAccessor();
        return services;
    }

    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
        return services;
    }
}