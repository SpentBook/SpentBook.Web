using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using SpentBook.Web.Config;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace SpentBook.Web.Email
{
    public class EmailService
    {
        private IEmailSender _emailSender;
        private SignInManager<ApplicationUser> _signInManager;
        private AppConfig _appConfig;

        public EmailService(
            IEmailSender emailSender,
            SignInManager<ApplicationUser> signInManager,
            AppConfig appConfig
        )
        {
            _emailSender = emailSender;
            _signInManager = signInManager;
            _appConfig = appConfig;
        }
        
        public async void ConfirmRegister(string urlCallbackConfirmation, ApplicationUser user)
        {
            var code = await _signInManager.UserManager.GenerateEmailConfirmationTokenAsync(user);
            var url = urlCallbackConfirmation
                        .Replace("{user-id}", user.Id)
                        .Replace("{code}", System.Net.WebUtility.UrlEncode(code));

            var email = user.Email;
            var subject = _appConfig.Email.ConfirmEmail.Subject;
            var content = _appConfig.Email.ConfirmEmail.Content
                            .Replace("{user-name}", user.FirstName)
                            .Replace("{url}", url);
            await _emailSender.SendEmailAsync(email, subject, content);
        }
    }
}