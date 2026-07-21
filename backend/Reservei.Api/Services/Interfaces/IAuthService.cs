using System.Threading.Tasks;
using Reservei.Api.DTOs.Auth;
using Reservei.Api.Models;

namespace Reservei.Api.Services.Interfaces;

public interface IAuthService
{
    Task CreateUserAsync(RegisterDto dto);
    Task<string> LoginUserAsync(LoginDto dto);
    string GenerateToken(AppUser user);
}