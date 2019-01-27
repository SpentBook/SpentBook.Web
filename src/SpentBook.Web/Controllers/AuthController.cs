using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SpentBook.Web.Config;
using SpentBook.Web.Email;
using SpentBook.Web.Jwt;
using SpentBook.Web.ViewsModels;

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
        public async Task<IActionResult> Login([FromBody]LoginViewModel credentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(credentials.UserName, credentials.Password, false, lockoutOnFailure: true);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User logged in.");

                    var user = await _userManager.FindByNameAsync(credentials.UserName);
                    var identity = _jwtFactory.GenerateClaimsIdentity(credentials.UserName, user.Id);

                    if (identity == null)
                        return BadRequest(Errors.AddErrorToModelState("login_failure", "Error on JWT creation ", ModelState));

                    var jwt = await Tokens.GenerateJwt(identity, _jwtFactory, credentials.UserName, _appConfig.Jwt, new JsonSerializerSettings { Formatting = Formatting.Indented });
                    return new OkObjectResult(jwt);
                }

                if (result.RequiresTwoFactor)
                {
                    return Ok();
                    //return RedirectToPage("./LoginWith2fa", new { ReturnUrl = returnUrl, RememberMe = Input.RememberMe });
                }

                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User account locked out.");
                    return BadRequest(Errors.AddErrorToModelState("login_failure", "User account locked out.", ModelState));
                }

                if (result.IsNotAllowed)
                {
                    _logger.LogWarning("User account is not allowed.");
                    return BadRequest(Errors.AddErrorToModelState("login_failure", "User account is not allowed, confirm your email!", ModelState));
                }

                return BadRequest(Errors.AddErrorToModelState("login_failure", "Invalid login attempt.", ModelState));
            }
        }

        // POST: /Auth/ConfirmEmailResend
        [HttpPost("ConfirmEmailResend")]
        public async Task<ActionResult> ConfirmEmailResend([FromBody]ConfirmEmailResendViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest(Errors.AddErrorToModelState("login_failure", "Email not found.", ModelState));

            _emailService.ConfirmRegister(model.UrlCallbackConfirmation, user);
            return new OkObjectResult(true);
        }
        
        // GET: /Auth/ConfirmEmail
        [HttpGet("ConfirmEmail")]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
                return BadRequest(Errors.AddErrorToModelState("error", "Invalid parameters", ModelState));

            var user = await _userManager.FindByIdAsync(userId);
            var result = await _userManager.ConfirmEmailAsync(user, code);

            if (result.Succeeded)
                return new OkObjectResult(true);

            return BadRequest(result);
        }
    }
}
