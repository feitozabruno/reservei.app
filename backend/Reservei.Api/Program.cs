using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Reservei.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddErrorHandling();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddIdentityConfiguration();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddApplicationServices();

var app = builder.Build();

app.UseExceptionHandler();
app.MapGet("/", () => "Hello, World!");
app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();

app.Run();