using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using SpentBook.Web.Services.Config;
using SpentBook.Web.Services.Jwt;

namespace SpentBook.Web.ViewsModels
{
    public class TokenViewModel
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public int SecondsToExpires { get; set;}

        public static async Task<TokenViewModel> GenerateAsync(IJwtFactory _jwtFactory, AppConfig _appConfig, string userId, string userName)
        {
            var identity = _jwtFactory.GenerateClaimsIdentity(userName, userId);

            if (identity == null)
                return null;

            var jwt = await _jwtFactory.GenerateJwt(identity, _jwtFactory, userName, _appConfig.Jwt, new JsonSerializerSettings { Formatting = Formatting.Indented });
            return new TokenViewModel
            {
                UserId = jwt.UserId,
                Token = jwt.Token,
                SecondsToExpires = jwt.SecondsToExpires
            };
        }
    }
}