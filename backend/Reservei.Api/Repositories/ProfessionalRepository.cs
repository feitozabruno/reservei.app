using System.Threading.Tasks;
using Reservei.Api.Data;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;

namespace Reservei.Api.Repositories;

public class ProfessionalRepository(AppDbContext context) : IProfessionalRepository
{
    private readonly AppDbContext _context = context;

    public async Task AddAsync(Professional professional)
    {
        await _context.Professionals.AddAsync(professional);
        await _context.SaveChangesAsync();
    }
}