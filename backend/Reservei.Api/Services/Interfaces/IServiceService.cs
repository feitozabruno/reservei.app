using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Service;
using Reservei.Api.Models;

namespace Reservei.Api.Services.Interfaces;

public interface IServiceService
{
    Task CreateAsync(CreateServiceDto dto);
    Task CreateRangeAsync(List<CreateServiceDto> dto);
    Task<IEnumerable<Service>> GetServicesByProfessionalIdAsync();
    Task<Service?> GetByIdAsync(Guid serviceId);
}