namespace Reservei.Api.Services.Interfaces;

public interface ICurrentUserService
{
    string UserId { get; }
    string Email { get; }
    string FullName { get; }
}