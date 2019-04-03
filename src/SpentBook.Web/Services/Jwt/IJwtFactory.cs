using System.Security.Claims;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SpentBook.Web.Services.Jwt
{
    public interface IJwtFactory
    {
        Task<(string UserId, string Token, int SecondsToExpires)> GenerateJwt(ClaimsIdentity identity, IJwtFactory jwtFactory, string userName, JwtIssuerOptions jwtOptions, JsonSerializerSettings serializerSettings);
        Task<string> GenerateEncodedToken(string userName, ClaimsIdentity identity);
        ClaimsIdentity GenerateClaimsIdentity(string userName, string id);
    }
}
