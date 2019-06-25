using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using SpentBook.Web.Services.Config;
using SpentBook.Web.Services.Jwt;

namespace SpentBook.Web.ViewsModels
{
    public class LoginResultViewModel
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public int SecondsToExpires { get; set; }
        public bool RequireConfirmedEmail { get; set; }
        public bool RequiresTwoFactor { get; set; }
        public bool RequireConfirmedPhoneNumber { get; set; }

        public static LoginResultViewModel Generate(SignInOptions signInOptions)
        {
            return new LoginResultViewModel
            {
                RequireConfirmedEmail = signInOptions.RequireConfirmedEmail,
                RequireConfirmedPhoneNumber = signInOptions.RequireConfirmedPhoneNumber,
            };
        }

        public static async Task<LoginResultViewModel> GenerateWithTokenAsync(IJwtFactory _jwtFactory, AppConfig _appConfig, string userId, string userName)
        {
            var identity = _jwtFactory.GenerateClaimsIdentity(userName, userId);

            if (identity == null)
                return null;

            var jwt = await _jwtFactory.GenerateJwt(identity, _jwtFactory, userName, _appConfig.Jwt, new JsonSerializerSettings { Formatting = Formatting.Indented });
            return new LoginResultViewModel
            {
                UserId = jwt.UserId,
                Token = jwt.Token,
                SecondsToExpires = jwt.SecondsToExpires
            };
        }
    }
}