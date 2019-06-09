using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.V3.Pages.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SpentBook.Web.Extensions;
using SpentBook.Web.ViewsModels;

using SpentBook.Web.Services.Error;
using SpentBook.Web.Services.Jwt;
using SpentBook.Web.Services.Config;
using SpentBook.Web.Services.Email;

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

        public AuthController(
            UserManager<ApplicationUser> userManager,
            IJwtFactory jwtFactory,
            AppConfig appConfig,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            EmailService emailService
        )
        {
            _userManager = userManager;
            _jwtFactory = jwtFactory;
            _appConfig = appConfig;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<ApplicationUser>();
            _emailService = emailService;
        }

        // POST api/auth/login
        [HttpPost("login")]
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
                var problemDetailsBuilder = new ModelStateBuilder<LoginViewModel>(this);

                if (identityResult.IsLockedOut)
                {
                    problemDetailsBuilder.SetFieldError(f => f.UserName, ProblemDetailsFieldType.IsLockedOut);
                    return new StatusCodeResult((int)System.Net.HttpStatusCode.Locked);
                }
                else if (identityResult.IsNotAllowed)
                {
                    problemDetailsBuilder.SetFieldError(f => f.UserName, ProblemDetailsFieldType.IsNotAllowed);
                    return Unauthorized();
                }
                else
                {
                    problemDetailsBuilder.SetFieldError(f => f.UserName, ProblemDetailsFieldType.UserNotFound);
                    return NotFound();
                }
            }

            var user = await _userManager.FindByNameAsync(loginModel.UserName);
            var token = await TokenViewModel.GenerateAsync(_jwtFactory, _appConfig, user.Id, loginModel.UserName);

            if (token == null)
            {
                var problemDetailsBuilder = new ModelStateBuilder<LoginViewModel>(this);
                problemDetailsBuilder.SetFieldError(f => f.UserName, ProblemDetailsFieldType.JwtError);
                return BadRequest();
            }

            return new OkObjectResult(token);
        }

        // POST: /Auth/ConfirmEmailResend
        [HttpPost("ConfirmEmailResend")]
        public async Task<IActionResult> ConfirmEmailResend([FromBody]ConfirmEmailResendViewModel model)
        {
            // if (!ModelState.IsValid)
            //     return BadRequest(new ErrorModel(this));

            var user = await _userManager.FindByEmailAsync(model.Email);
            // if (user == null)
            //     return BadRequest(new ErrorModel(this, ErrorType.UserNotFound));

            _emailService.ConfirmRegister(model.UrlCallbackConfirmation, user);
            return new EmptyResult();
        }

        // GET: /Auth/ConfirmEmail
        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            // if (!ModelState.IsValid || userId == null || code == null)
            //     return BadRequest(new ErrorModel(this));

            var user = await _userManager.FindByIdAsync(userId);
            // if (user == null)
            //     return BadRequest(new ErrorModel(this, ErrorType.UserNotFound));

            var identityResult = await _userManager.ConfirmEmailAsync(user, code);

            // if (!identityResult.Succeeded)
            //     return BadRequest(new ErrorModel(this, identityResult, ErrorType.ConfirmEmailError));

            return new EmptyResult();
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody]ConfirmEmailResendViewModel model)
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
            var user = await _userManager.FindByIdAsync(model.UserId);
            // if (user == null)
            //     return BadRequest(new ErrorModel(this, ErrorType.UserNotFound));

            var identityResult = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);

            // if (!identityResult.Succeeded)
            //     return BadRequest(new ErrorModel(this, identityResult, ErrorType.ChangePasswordError));

            return new EmptyResult();
        }
    }
}
