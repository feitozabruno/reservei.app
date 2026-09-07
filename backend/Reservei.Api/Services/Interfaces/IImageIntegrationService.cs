using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Reservei.Api.DTOs.Image;

namespace Reservei.Api.Services.Interfaces;

public interface IImageIntegrationService
{
    Task<ImageResponseDto> UploadImageAsync(IFormFile file);
}