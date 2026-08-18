using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Reservei.Api.Data;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;

namespace Reservei.Api.Repositories;

public class ProfessionalRepository(AppDbContext context) : IProfessionalRepository
{
    public async Task AddAsync(Professional professional)
    {
        await context.Professionals.AddAsync(professional);
        await context.SaveChangesAsync();
    }

    public async Task<Professional?> GetProfessionalByUserIdAsync(string userId)
    {
        return await context.Professionals
            .Where(p => p.UserId == userId)
            .FirstOrDefaultAsync();
    }

    public async Task<Professional?> GetByIdAsync(Guid professionalId)
    {
        return await context.Professionals
            .Where(p => p.Id == professionalId)
            .FirstOrDefaultAsync();
    }

    public async Task<Professional?> GetByUsernameAsync(string username)
    {
        return await context.Professionals
            .Where(p => p.Username == username)
            .FirstOrDefaultAsync();
    }
}