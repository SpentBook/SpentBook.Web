using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using SpentBook.Web.Config;
using System.Threading.Tasks;

namespace SpentBook.Web.Email
{
    public class SendGridService : IEmailSender
    {
        public AppConfig _appConfig { get; } //set only via Secret Manager

        public SendGridService(AppConfig appConfig)
        {
            _appConfig = appConfig;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            var client = new SendGridClient(_appConfig.Email.SendGridKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(_appConfig.Email.From, _appConfig.Email.Name),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };

            msg.AddTo(new EmailAddress(email));

            // Disable click tracking.
            // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);
        }
    }
}