using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using SpentBook.Web.Services.Config;
using SpentBook.Web.Services.Email;
using SpentBook.Web.Services.Error;
using SpentBook.Web.Services.Jwt;

namespace SpentBook.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppConfig _appConfig;
        private readonly IJwtFactory _jwtFactory;
        private readonly EmailService _emailService;

        private readonly ILogger _logger;

        private readonly ApplicationDbContext _appDbContext;
        private readonly IMapper _mapper;

        public UserController(
            UserManager<ApplicationUser> userManager,
            IMapper mapper,
            ILoggerFactory loggerFactory,
            SignInManager<ApplicationUser> signInManager,
            AppConfig appConfig,
            IJwtFactory jwtFactory,
            EmailService emailService
        )
        {
            _userManager = userManager;
            _mapper = mapper;
            _logger = loggerFactory.CreateLogger<UserController>();
            _signInManager = signInManager;
            _appConfig = appConfig;
            _jwtFactory = jwtFactory;
            _emailService = emailService;
        }

        // PUT api/user
        [HttpPut]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Put([FromBody]ApplicationUser model)
        {
            var user = await GetCurrentUser();

            if (user == null)
            {
                var pb = new ModelStateBuilder<ApplicationUser>(this);
                pb.SetFieldError(f => f.Id, ProblemDetailsFieldType.UserNotFound);
                return this.NotFound();
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Gender = model.Gender;
            user.DateOfBirth = model.DateOfBirth;

            var identityResult = await _signInManager.UserManager.UpdateAsync(user);

            if (!identityResult.Succeeded)
            {
                var pb = new ModelStateBuilder<ApplicationUser>(this, identityResult)
                    .SetIdentityErrorEmail(e => e.Email);
                return this.BadRequest();
            }

            return Ok();
        }

        // GET api/user
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get()
        {
            var user = await GetCurrentUser();

            if (user == null)
            {
                var pb = new ModelStateBuilder<ApplicationUser>(this);
                pb.SetFieldError(f => f.Id, ProblemDetailsFieldType.UserNotFound);
                return this.NotFound();
            }

            return Ok(user);
        }

        // DELETE api/user
        [HttpDelete]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete()
        {
            var user = await this.GetCurrentUser();
            if (user == null)
            {
                var pb = new ModelStateBuilder<ApplicationUser>(this);
                pb.SetFieldError(f => f.Id, ProblemDetailsFieldType.UserNotFound);
                return this.NotFound();
            }

            var identityResult = await _signInManager.UserManager.DeleteAsync(user);

            if (!identityResult.Succeeded)
            {
                var pb = new ModelStateBuilder<ApplicationUser>(this, identityResult)
                    .SetIdentityErrorEmail(e => e.Email);
                return this.BadRequest();
            }

            return Ok();
        }

        private async Task<ApplicationUser> GetCurrentUser()
        {
            var identity = User.Identity as ClaimsIdentity;
            var identityClaim = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByEmailAsync(identityClaim.Value);
            return user;
        }

    }
}
