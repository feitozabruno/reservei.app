using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Reservei.Api.DTOs.Image;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class ImageIntegrationService(HttpClient httpClient, IConfiguration config) : IImageIntegrationService
{
    public async Task<ImageResponseDto> UploadImageAsync(IFormFile file)
    {
        using var content = new MultipartFormDataContent();
        using var fileStream = file.OpenReadStream();
        using var streamContent = new StreamContent(fileStream);

        streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
        content.Add(streamContent, "file", file.FileName);

        var apiUrl = config["ImageStorageApiUrl"]
            ?? throw new ArgumentNullException("A URL da ImageStorageApi não foi configurada.");

        var response = await httpClient.PostAsync(apiUrl, content);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ImageResponseDto>();

        return result ?? throw new Exception("Não foi possível ler a resposta da API de Image Storage.");
    }
}