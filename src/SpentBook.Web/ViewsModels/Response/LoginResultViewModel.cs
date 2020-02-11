using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using SpentBook.Web.Services.Config;
using SpentBook.Web.Services.Jwt;

namespace SpentBook.Web.ViewsModels
{
    public class LoginResponse
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public int SecondsToExpires { get; set; }
        public bool RequireConfirmedEmail { get; set; }
        public bool RequiresTwoFactor { get; set; }
        public bool RequireConfirmedPhoneNumber { get; set; }

        public static LoginResponse Generate(SignInOptions signInOptions)
        {
            return new LoginResponse
            {
                RequireConfirmedEmail = signInOptions.RequireConfirmedEmail,
                RequireConfirmedPhoneNumber = signInOptions.RequireConfirmedPhoneNumber,
            };
        }

        public static async Task<LoginResponse> GenerateWithTokenAsync(IJwtFactory _jwtFactory, AppConfig _appConfig, ApplicationUser user)
        {
            var token = await _jwtFactory.GenerateEncodedToken(user);

            return new LoginResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Token = token,
                SecondsToExpires = (int)_appConfig.Jwt.ValidFor.TotalSeconds
            };
        }
    }
}