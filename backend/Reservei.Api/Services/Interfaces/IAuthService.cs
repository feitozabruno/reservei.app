using System.Threading.Tasks;
using Reservei.Api.DTOs.Auth;

namespace Reservei.Api.Services.Interfaces;

public interface IAuthService
{
    Task CreateUserAsync(RegisterDto dto);
}