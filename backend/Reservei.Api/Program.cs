using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Reservei.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddIdentityConfiguration();
builder.Services.AddApplicationServices();

var app = builder.Build();
app.MapGet("/", () => "Hello, World!");
app.MapControllers();
app.Run();