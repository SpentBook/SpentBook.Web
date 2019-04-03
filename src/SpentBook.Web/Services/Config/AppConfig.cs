using SpentBook.Web.Services.Email;
using SpentBook.Web.Services.Facebook;
using SpentBook.Web.Services.Jwt;

namespace SpentBook.Web.Services.Config
{
    public class AppConfig
    {
        public int MaxFailedAccessAttempts { get; set; }
        public int TimeoutUserBlocked { get; set; }
        public int TimeoutTokenLogin { get; set; }
        public int TimeoutTokenEmailConfirmation { get; set; }
        public int TimeoutTokenResetPassword { get; set; }
        public bool NewUserAsLocked { get; set; }

        public JwtIssuerOptions Jwt { get; set; }
        
        public FacebookConfig Facebook { get; set; }

        public EmailConfig Email { get; set; }
    }
}