using SpentBook.Web.Services.Jwt;

namespace SpentBook.Web.Services.Email
{
    public class EmailConfig
    {
        public string SendGridKey { get; set; }
        public string From { get; set; }
        public string Name { get; set; }

        public EmailTemplate ConfirmEmail { get;set; }
        public EmailTemplate ResetPassword { get;set; }
    }
}