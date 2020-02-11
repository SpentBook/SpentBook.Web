using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SpentBook.Web.Services.Config;
using SpentBook.Web.ViewsModels;

namespace SpentBook.Web.Services.Jwt
{
    public class JwtFactory : IJwtFactory
    {
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly UserManager<ApplicationUser> _userManager;

        public JwtFactory(AppConfig appConfig, UserManager<ApplicationUser> userManager)
        {
            this._jwtOptions = appConfig.Jwt;
            this._userManager = userManager;
            ThrowIfInvalidOptions(_jwtOptions);
        }

        // public string GenerateToken(ApplicationUser user)
        // {
        //     var tokenHandler = new JwtSecurityTokenHandler();
        //     var key = Encoding.ASCII.GetBytes(this._jwtOptions.SecretKey);
        //     var tokenDescriptor = new SecurityTokenDescriptor
        //     {
        //         Subject = new ClaimsIdentity(new Claim[]
        //         {
        //             new Claim(ClaimTypes.Name, user.Username.ToString()),
        //             new Claim(ClaimTypes.Role, user.Role.ToString())
        //         }),
        //         Expires = _jwtOptions.Expiration,
        //         SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        //     };
        //     var token = tokenHandler.CreateToken(tokenDescriptor);
        //     return tokenHandler.WriteToken(token);
        // }

        public async Task<string> GenerateEncodedToken(ApplicationUser user)
        {
            var roles = await this._userManager.GetRolesAsync(user);

            // var claims = new List<Claim>
            // {
            //     new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            //     new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
            //     new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
            //     new Claim(Constants.Id, user.Id),
            // };

            // // Roles property is string collection but you can modify Select code if it it's not
            // claims.AddRange(roles.Select(role => new Claim("role", role)));
            
            // // Create the JWT security token and encode it.
            // var jwt = new JwtSecurityToken(
            //     issuer: _jwtOptions.Issuer,
            //     audience: _jwtOptions.Audience,
            //     claims: claims,
            //     notBefore: _jwtOptions.NotBefore,
            //     expires: _jwtOptions.Expiration,
            //     signingCredentials: _jwtOptions.SigningCredentials);

            var payload = new JwtPayload
            {

                { CustomHeaders.Id, user.Id },
                { JwtRegisteredClaimNames.Iss, _jwtOptions.Issuer },
                { JwtRegisteredClaimNames.Aud, _jwtOptions.Audience },
                { JwtRegisteredClaimNames.Nbf, ToUnixEpochDate(_jwtOptions.NotBefore) },
                { JwtRegisteredClaimNames.Exp, ToUnixEpochDate(_jwtOptions.Expiration) },
                { JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt) },
                { JwtRegisteredClaimNames.Sub, user.UserName },
                { JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()},
                { CustomHeaders.Roles, roles }
            };

            var jwt = new JwtSecurityToken(new JwtHeader(_jwtOptions.SigningCredentials), payload);
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }

        /// <returns>Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).</returns>
        private static long ToUnixEpochDate(DateTime date)
          => (long)Math.Round((date.ToUniversalTime() -
                               new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
                              .TotalSeconds);

        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }
    }
}
