using System.Threading.Tasks;
using Reservei.Api.Models;

namespace Reservei.Api.Repositories.Interfaces;

public interface IGuestRepository
{
    Task AddAsync(Guest guest);
}