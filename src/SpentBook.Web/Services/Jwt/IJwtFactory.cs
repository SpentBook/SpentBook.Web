using System.Security.Claims;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SpentBook.Web.Services.Jwt
{
    public interface IJwtFactory
    {
        Task<string> GenerateEncodedToken(ApplicationUser user);
    }
}
