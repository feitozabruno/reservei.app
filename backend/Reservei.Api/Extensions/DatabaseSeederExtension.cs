using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Reservei.Api.Data;

namespace Reservei.Api.Extensions;

public static class DatabaseSeederExtension
{
    public static void SeedDatabase(this WebApplication app)
    {
        if (app.Environment.IsEnvironment("Testing")) return;

        if (app.Environment.IsDevelopment())
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            dbContext.Database.EnsureCreated();

            DatabaseSeeder.Seed(dbContext);
        }
    }
}