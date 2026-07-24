using Microsoft.Extensions.DependencyInjection;

namespace Reservei.Api.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddWebCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("Web", policy =>
            {
                policy.WithOrigins("http://localhost:3000", "https://reservei.app")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }
}