using System.Threading.Tasks;

namespace Reservei.Api.Services.Interfaces;

public interface IEmailService
{
    Task SendAsync(string toEmail, string subject, string bodyHtml);
}