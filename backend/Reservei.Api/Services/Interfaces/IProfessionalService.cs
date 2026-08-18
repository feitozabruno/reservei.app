using System;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Professional;
using Reservei.Api.Models;

namespace Reservei.Api.Services.Interfaces;

public interface IProfessionalService
{
    Task CreateAsync(CreateProfessionalDto dto);
    Task<Professional?> GetProfessionalByUserIdAsync();
    Task<Professional?> GetByIdAsync(Guid professionalId);
    Task<ProfessionalResponseDto?> GetByUsernameAsync(string username);
}