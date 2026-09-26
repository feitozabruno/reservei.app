using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Reservei.Api.Data;
using Reservei.Api.Exceptions;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;

namespace Reservei.Api.Repositories;

public class ProfessionalRepository(AppDbContext db) : IProfessionalRepository
{
    public async Task AddAsync(Professional professional)
    {
        await db.Professionals.AddAsync(professional);
        await db.SaveChangesAsync();
    }

    public async Task<Professional?> GetByUserIdAsync(string userId)
    {
        return await db.Professionals
            .Where(p => p.UserId == userId)
            .FirstOrDefaultAsync();
    }

    public async Task<Professional?> GetByIdAsync(Guid professionalId)
    {
        return await db.Professionals
            .Where(p => p.Id == professionalId)
            .FirstOrDefaultAsync();
    }

    public async Task<Professional?> GetByUsernameAsync(string username)
    {
        return await db.Professionals
            .Where(p => p.Username == username)
            .Include(p => p.Services)
            .Include(p => p.Availabilities)
            .FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(Professional professional)
    {
        db.Professionals.Update(professional);
        await db.SaveChangesAsync();
    }

    public async Task<(List<Professional>, int TotalCount)> GetAllPagedAsync(int pageNumber, int pageSize)
    {
        var query = db.Professionals.AsNoTracking();

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(p => p.FullName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task DeleteAsync(Guid professionalId)
    {
        var professional = await db.Professionals.FirstOrDefaultAsync(p => p.Id == professionalId);

        if (professional is null) throw new NotFoundException("Perfil profissional não encontrado.");

        db.Professionals.Remove(professional);

        await db.SaveChangesAsync();
    }
}