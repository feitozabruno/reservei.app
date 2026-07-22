using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Reservei.Api.Exceptions;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public string UserId =>
        _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthenticatedException("Usuário não autenticado.");

    public string Email =>
        _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email)
        ?? throw new UnauthenticatedException("Email não encontrado no token.");

    public string FullName =>
        _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name)
        ?? throw new UnauthenticatedException("Nome não encontrado no token.");
}