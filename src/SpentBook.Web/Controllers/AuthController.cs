using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using AutoMapper;

using SpentBook.Web.Services.Error;
using SpentBook.Web.Services.Jwt;
using SpentBook.Web.Services.Config;
using SpentBook.Web.Services.Email;
using SpentBook.Web.ViewsModels;
using SpentBook.Web.Extensions;

namespace SpentBook.Web
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtFactory _jwtFactory;
        private readonly AppConfig _appConfig;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger _logger;
        private readonly EmailService _emailService;
        private readonly IMapper _mapper;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            IJwtFactory jwtFactory,
            AppConfig appConfig,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            EmailService emailService,
            IMapper mapper
        )
        {
            _userManager = userManager;
            _jwtFactory = jwtFactory;
            _appConfig = appConfig;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<ApplicationUser>();
            _emailService = emailService;
            _mapper = mapper;
        }

        // POST api/auth/register
        [HttpPost("Register")]
        [ProducesResponseType(typeof(LoginResultViewModel), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LoginResultViewModel>> Register([FromBody]RegistrationViewModel model)
        {
            var user = new ApplicationUser();
            user.UserName = model.Email;
            user.Email = model.Email;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            var identityResult = await _signInManager.UserManager.CreateAsync(user, model.Password);

            if (!identityResult.Succeeded)
            {
                var pb = new ModelStateBuilder<RegistrationViewModel>(this, identityResult)
                    .SetIdentityErrorEmail(e => e.Email)
                    .SetIdentityErrorPassword(e => e.Password);

                if (pb.HasProblem(e => e.Email, ProblemDetailsFieldType.DuplicateUserName))
                    return this.Conflict();

                return this.BadRequest();
            }

            // Register as locked if enabled
            // if (_appConfig.NewUserAsLocked)

            if (_signInManager.Options.SignIn.RequireConfirmedEmail)
            {
                // var lockoutEndDate = new DateTime(2999,01,01);
                // await _userManager.SetLockoutEnabledAsync(userIdentity, true);
                // await  _userManager.SetLockoutEndDateAsync(userIdentity, lockoutEndDate);

                _emailService.ConfirmRegister(model.UrlCallbackConfirmation, user);
                var authModel = LoginResultViewModel.Generate(_signInManager.Options.SignIn);
                return this.OkCreated(authModel);
            }
            else
            {
                var authModel = await LoginResultViewModel.GenerateWithTokenAsync(_jwtFactory, _appConfig, user.Id, user.UserName);
                if (authModel == null)
                {
                    var pb = new ModelStateBuilder<RegistrationViewModel>(this);
                    pb.SetFieldError(f => f.Email, ProblemDetailsFieldType.JwtError);
                    return this.BadRequest();
                }

                return this.OkCreated(authModel);
            }
        }

        // POST api/auth/login
        [HttpPost("Login")]
        [ProducesResponseType(typeof(LoginResultViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status423Locked)]
        public async Task<IActionResult> Login([FromBody]LoginViewModel loginModel)
        {
            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, set lockoutOnFailure: true
            var identityResult = await _signInManager.PasswordSignInAsync(loginModel.UserName, loginModel.Password, false, lockoutOnFailure: true);

            // if (result.RequiresTwoFactor)
            // {
            //     return Ok();
            // }

            if (!identityResult.Succeeded)
            {
                var pb = new ModelStateBuilder<LoginViewModel>(this);

                if (identityResult.IsLockedOut)
                {
                    pb.SetFieldError(f => f.UserName, ProblemDetailsFieldType.IsLockedOut);
                    return this.Locked();
                }
                else if (identityResult.IsNotAllowed)
                {
                    pb.SetFieldError(f => f.UserName, ProblemDetailsFieldType.IsNotAllowed);
                    return this.Unauthorized();
                }
                else
                {
                    pb.SetFieldError(f => f.UserName, ProblemDetailsFieldType.UserNotFound);
                    return this.NotFound();
                }
            }

            var user = await _userManager.FindByNameAsync(loginModel.UserName);
            var token = await LoginResultViewModel.GenerateWithTokenAsync(_jwtFactory, _appConfig, user.Id, loginModel.UserName);
            if (token == null)
            {
                var pb = new ModelStateBuilder<LoginViewModel>(this);
                pb.SetFieldError(f => f.UserName, ProblemDetailsFieldType.JwtError);
                return this.BadRequest();
            }
            else
            {
                token.RequiresTwoFactor = identityResult.RequiresTwoFactor;
                return this.Ok(token);
            }
        }

        // POST: /Auth/ConfirmEmailResend
        [HttpPost("ConfirmEmailResend")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ConfirmEmailResend([FromBody]UserCodeViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                var pb = new ModelStateBuilder<UserCodeViewModel>(this);
                pb.SetFieldError(f => f.Email, ProblemDetailsFieldType.UserNotFound);
                return this.NotFound();
            }

            _emailService.ConfirmRegister(model.UrlCallbackConfirmation, user);
            return this.Ok();
        }

        // GET: /Auth/ConfirmEmail
        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody]UserCodeViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                var pb = new ModelStateBuilder<object>(this);
                pb.SetFieldError(nameof(model.UserId), ProblemDetailsFieldType.UserNotFound);
                return this.NotFound();
            }

            var identityResult = await _userManager.ConfirmEmailAsync(user, model.Code);

            if (!identityResult.Succeeded)
            {
                var pb = new ModelStateBuilder<object>(this);
                pb.SetFieldError(nameof(model.Code), ProblemDetailsFieldType.Invalid, "Invalid token.");
                return this.BadRequest();
            }

            return Ok();
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody]UserCodeViewModel model)
        {
            // if (!ModelState.IsValid)
            //     return BadRequest(new ErrorModel(this));

            var user = await _userManager.FindByEmailAsync(model.Email);
            // if (user == null)
            //     return BadRequest(new ErrorModel(this, ErrorType.UserNotFound));

            _emailService.ResetPassword(model.UrlCallbackConfirmation, user);
            return new EmptyResult();
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody]ChangePasswordViewModel model)
        {
            /// TODO: CRIAR FILTRO
            if (!ModelState.IsValid)
                return BadRequest();

            /// TODO: MOVER PARA VALIDATION
            // if (model.Password != model.ConfirmPassword)
            //     return BadRequest(new ErrorViewModel(this, ErrorType.PasswordNotMatch));

            /// TODO: VER FORMA DE FAZER VIA FILTRO NO PARAMETRO
            var user = await _userManager.FindByEmailAsync(model.Email);
            // if (user == null)
            //     return BadRequest(new ErrorModel(this, ErrorType.UserNotFound));

            var identityResult = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);

            // if (!identityResult.Succeeded)
            //     return BadRequest(new ErrorModel(this, identityResult, ErrorType.ChangePasswordError));

            return new EmptyResult();
        }
    }
}
