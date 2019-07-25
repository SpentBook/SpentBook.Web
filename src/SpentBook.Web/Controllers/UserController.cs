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
using SpentBook.Web.ViewsModels;

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
                this.SetUserNotFound();
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
                this.SetUserNotFound();
                return this.NotFound();
            }

            return Ok(user);
        }

        // DELETE api/user
        [Route("ChangePassword")]
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ChangePassword(ChangePasswordProfileRequest request)
        {
            var user = await this.GetCurrentUser();
            if (user == null)
            {
                this.SetUserNotFound();
                return this.NotFound();
            }

            IdentityResult identityResult;
            if (string.IsNullOrEmpty(request.PasswordCurrent) && !await _signInManager.UserManager.HasPasswordAsync(user))
            {
                // 1) Se não existir senha cadastrada: Cadastro proveniente de alguma rede social
                identityResult = await _signInManager.UserManager.AddPasswordAsync(user, request.Password);
            }
            else if (string.IsNullOrWhiteSpace(request.PasswordCurrent))
            {
                // 2) Se o usuário tem senha, mas não preencheu o campo
                new ModelStateBuilder<ChangePasswordProfileRequest>(this)
                    .SetFieldError(e => e.PasswordCurrent, ProblemDetailsFieldType.Required);
                return this.BadRequest();
            }
            else
            {
                // 3) Se existir senha cadastrada ou se ele digitou algo no campo "senha corrente"
                identityResult = await _signInManager.UserManager.ChangePasswordAsync(user, request.PasswordCurrent, request.Password);
            }

            if (!identityResult.Succeeded)
            {
                // 1) Adiciona no campo PasswordCurrent apenas se o erro for igual a PasswordMismatch
                // 2) Adiciona no campo Password apenas se o erro for diferente de PasswordMismatch
                var pb = new ModelStateBuilder<ChangePasswordProfileRequest>(this, identityResult)
                    .SetIdentityErrorPassword(e => e.PasswordCurrent, t => t == ProblemDetailsFieldType.PasswordMismatch)
                    .SetIdentityErrorPassword(e => e.Password, t => t != ProblemDetailsFieldType.PasswordMismatch);

                return this.BadRequest();
            }

            return Ok();
        }

        // DELETE api/user
        [Route("Unregister")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Unregister(UnregisterRequest request)
        {
            // 1) Faz o login para garantir que a senha está correta
            var email = GetCurrentEmail();
            var signResult = await _signInManager.PasswordSignInAsync(email, request.Password, false, lockoutOnFailure: true);
            if (!signResult.Succeeded)
            {
                new ModelStateBuilder<UnregisterRequest>(this)
                    .SetFieldError(f => f.Password, ProblemDetailsFieldType.PasswordMismatch);

                return this.BadRequest();
            }

            // 2) Recupera o usuário logado
            var user = await this.GetCurrentUser();
            if (user == null)
            {
                this.SetUserNotFound();
                return this.NotFound();
            }

            // 3) Deleta o usuário
            var identityResult = await _userManager.DeleteAsync(user);
            if (!identityResult.Succeeded)
            {
                new ModelStateBuilder<UnregisterRequest>(this);
                return this.BadRequest();
            }

            return Ok();
        }

        private async Task<ApplicationUser> GetCurrentUser()
        {
            var email = GetCurrentEmail();
            var user = await _userManager.FindByEmailAsync(email);
            return user;
        }

        private string GetCurrentEmail()
        {
            var identity = User.Identity as ClaimsIdentity;
            var identityClaim = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return identityClaim.Value;
        }
        private void SetUserNotFound()
        {
            new ModelStateBuilder<ApplicationUser>(this)
                                .SetFieldError(nameof(ApplicationUser.UserName), ProblemDetailsFieldType.UserNotFound);
        }

    }
}
