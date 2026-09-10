using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.Models;

namespace Reservei.Api.Repositories.Interfaces;

public interface IProfessionalRepository
{
    Task AddAsync(Professional professional);
    Task<Professional?> GetByUserIdAsync(string userId);
    Task<Professional?> GetByIdAsync(Guid professionalId);
    Task<Professional?> GetByUsernameAsync(string username);
    Task UpdateAsync(Professional professional);
    Task<(List<Professional>, int TotalCount)> GetAllPagedAsync(int pageNumber, int pageSize);
}