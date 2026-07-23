using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.MsSql;
using Reservei.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

namespace Reservei.Api.Tests.Fixtures;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly MsSqlContainer _sqlServer = new MsSqlBuilder(
        "mcr.microsoft.com/mssql/server:2025-latest").Build();

    public async Task InitializeAsync()
    {
        // Roda antes de todos os testes - sobe o container
        await _sqlServer.StartAsync();

        // Roda as migrations após o container subir
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await _sqlServer.DisposeAsync();
        await base.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove o DbContext registrado no Program.cs
            // (que aponta para o SQL Server local)
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>)
            );

            if (descriptor is not null) services.Remove(descriptor);

            // Registra um novo DbCOntext apontando para o Testcontainers
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(_sqlServer.GetConnectionString()));
        });
    }
}