using System.Threading.Tasks;
using Reservei.Api.DTOs.Professional;
using Reservei.Api.Models;

namespace Reservei.Api.Services.Interfaces;

public interface IProfessionalService
{
    Task CreateAsync(CreateProfessionalDto dto);
    Task<Professional?> GetProfessionalByUserIdAsync();
}