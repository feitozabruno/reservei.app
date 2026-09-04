using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reservei.Api.DTOs.Service;
using Reservei.Api.Exceptions;
using Reservei.Api.Models;
using Reservei.Api.Repositories.Interfaces;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class ServiceService(
    IProfessionalService professionalService,
    IServiceRepository serviceRepository
) : IServiceService
{
    public async Task CreateAsync(CreateServiceDto dto)
    {
        Professional? professional = await professionalService.GetByUserIdAsync();
        Guid? professionalId = professional?.Id;
        if (professionalId is null) throw new NotFoundException("Profissional não encontrado para o usuário logado.");

        Service service = new Service
        {
            ProfessionalId = professionalId.Value,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            DurationMinutes = dto.DurationMinutes
        };

        await serviceRepository.AddAsync(service);
    }

    public async Task CreateRangeAsync(List<CreateServiceDto> dto)
    {
        Professional? professional = await professionalService.GetByUserIdAsync();
        Guid? professionalId = professional?.Id;
        if (professionalId is null) throw new NotFoundException("Profissional não encontrado para o usuário logado.");

        List<Service> newServices = dto
            .Select(service => new Service
            {
                ProfessionalId = professionalId.Value,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                DurationMinutes = service.DurationMinutes
            })
            .ToList();

        await serviceRepository.AddRangeAsync(newServices);
    }

    public async Task<IEnumerable<Service>> GetServicesByProfessionalIdAsync()
    {
        Professional? professional = await professionalService.GetByUserIdAsync();
        Guid? professionalId = professional?.Id;
        if (professionalId is null) throw new NotFoundException("Profissional não encontrado para o usuário logado.");

        IEnumerable<Service> services = await serviceRepository.GetServicesByProfessionalIdAsync(professionalId.Value);
        return services;
    }

    public async Task<Service?> GetByIdAsync(Guid serviceId)
    {
        return await serviceRepository.GetByIdAsync(serviceId);
    }
}