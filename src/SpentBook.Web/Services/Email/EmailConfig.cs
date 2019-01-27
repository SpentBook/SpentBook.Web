using SpentBook.Web.Jwt;

namespace SpentBook.Web.Email
{
    public class EmailConfig
    {
        public string SendGridKey { get; set; }
        public string From { get; set; }
        public string Name { get; set; }

        public EmailTemplate ConfirmEmail { get;set; }
    }
}