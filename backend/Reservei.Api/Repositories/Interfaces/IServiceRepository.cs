using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.Models;

namespace Reservei.Api.Repositories.Interfaces;

public interface IServiceRepository
{
    Task AddAsync(Service service);
    Task AddRangeAsync(IEnumerable<Service> services);
    Task<IEnumerable<Service>> GetServicesByProfessionalIdAsync(Guid professionalId);
}