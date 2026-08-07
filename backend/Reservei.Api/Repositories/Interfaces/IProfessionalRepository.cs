using System.Threading.Tasks;
using Reservei.Api.Models;

namespace Reservei.Api.Repositories.Interfaces;

public interface IProfessionalRepository
{
    Task AddAsync(Professional professional);
    Task<Professional?> GetProfessionalByUserIdAsync(string userId);
}