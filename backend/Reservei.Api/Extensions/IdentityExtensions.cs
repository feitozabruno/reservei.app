using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Reservei.Api.Data;
using Reservei.Api.Models;

namespace Reservei.Api.Extensions;

public static class IdentityExtensions
{
    public static IServiceCollection AddIdentityConfiguration(this IServiceCollection services)
    {
        services.AddIdentity<AppUser, IdentityRole>(options =>
        {
            // Regras de senha
            options.Password.RequiredLength = 6;
            options.Password.RequireDigit = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;

            // Regras de usuário
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<AppDbContext>(); // armazena tudo no database

        return services;
    }
}