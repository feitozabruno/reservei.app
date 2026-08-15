using System.Threading.Tasks;
using Reservei.Api.Data;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;

namespace Reservei.Api.Repositories;

public class GuestRepository(AppDbContext context) : IGuestRepository
{
    public async Task AddAsync(Guest guest)
    {
        await context.AddAsync(guest);
        await context.SaveChangesAsync();
    }
}