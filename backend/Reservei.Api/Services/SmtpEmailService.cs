using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class SmtpEmailService(IOptions<SmtpSettings> smtpSettings) : IEmailService
{
    private readonly SmtpSettings _smtpSettings = smtpSettings.Value;

    public async Task SendAsync(string toEmail, string subject, string bodyHtml)
    {
        // 1. Monta a estrutura do e-mail (MimeMessage)
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_smtpSettings.FromName, _smtpSettings.FromEmail));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;

        // Define que o corpo será HTML, permitindo links e formatação
        email.Body = new TextPart(TextFormat.Html)
        {
            Text = bodyHtml
        };

        // 2. Conecta no servidor SMTP e faz o envio
        using var smtp = new SmtpClient();

        try
        {
            // Conecta no host e porta (localhost e 2525)
            // O "false" indica que não estamos forçando SSL localmente
            await smtp.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, false);

            // Nota: Se fosse um servidor real (Gmail, AWS), você usaria:
            // await smtp.AuthenticateAsync("seu-usuario", "sua-senha");

            await smtp.SendAsync(email);
        }
        finally
        {
            // Sempre desconecta de forma limpa, independente de sucesso ou erro
            await smtp.DisconnectAsync(true);
        }
    }
}

public class SmtpSettings
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
}