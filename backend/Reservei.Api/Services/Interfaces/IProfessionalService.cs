using System.Threading.Tasks;
using Reservei.Api.DTOs.Professional;

namespace Reservei.Api.Services.Interfaces;

public interface IProfessionalService
{
    Task CreateAsync(CreateProfessionalDto dto);
}