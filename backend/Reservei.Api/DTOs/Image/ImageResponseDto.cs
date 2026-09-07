namespace Reservei.Api.DTOs.Image;

public record ImageResponseDto
{
    public string Url { get; set; } = string.Empty;
    public string Pathname { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string ContentDisposition { get; set; } = string.Empty;
    public string UploadedAt { get; set; } = string.Empty;
    public int Size;
}