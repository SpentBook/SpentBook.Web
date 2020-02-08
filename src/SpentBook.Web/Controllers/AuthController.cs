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
using Newtonsoft.Json;
using System.Net.Http;
using System;

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
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LoginResponse>> Register([FromBody]RegistrationRequest model)
        {
            var user = new ApplicationUser();
            user.UserName = model.Email;
            user.Email = model.Email;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.DateOfBirth = model.DateOfBirth;

            var identityResult = await _signInManager.UserManager.CreateAsync(user, model.Password);

            if (!identityResult.Succeeded)
            {
                var pb = new ModelStateBuilder<RegistrationRequest>(this, identityResult)
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
                var authModel = LoginResponse.Generate(_signInManager.Options.SignIn);
                return this.OkCreated(authModel);
            }
            else
            {
                var authModel = await LoginResponse.GenerateWithTokenAsync(_jwtFactory, _appConfig, user);
                if (authModel == null)
                {
                    var pb = new ModelStateBuilder<RegistrationRequest>(this);
                    pb.SetFieldError(f => f.Email, ProblemDetailsFieldType.JwtError);
                    return this.BadRequest();
                }

                return this.OkCreated(authModel);
            }
        }

        // POST api/auth/login
        [HttpPost("Login")]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status423Locked)]
        public async Task<IActionResult> Login([FromBody]LoginRequest loginModel)
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
                var pb = new ModelStateBuilder<LoginRequest>(this);

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
            var token = await LoginResponse.GenerateWithTokenAsync(_jwtFactory, _appConfig, user);
            if (token == null)
            {
                var pb = new ModelStateBuilder<LoginRequest>(this);
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
        public async Task<IActionResult> ConfirmEmailResend([FromBody]ConfirmEmailResendRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                var pb = new ModelStateBuilder<ConfirmEmailResendRequest>(this);
                pb.SetFieldError(f => f.Email, ProblemDetailsFieldType.UserNotFound);
                return this.NotFound();
            }

            _emailService.ConfirmRegister(model.UrlCallbackConfirmation, user);
            return this.Ok();
        }

        // GET: /Auth/ConfirmEmail
        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody]CodeConfirmationRequest model)
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
        public async Task<IActionResult> ResetPassword([FromBody]ResetEmailRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                var pb = new ModelStateBuilder<ResetEmailRequest>(this);
                pb.SetFieldError(f => f.Email, ProblemDetailsFieldType.UserNotFound);
                return this.NotFound();
            }

            _emailService.ResetPassword(model.UrlCallbackConfirmation, user);
            return Ok();
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody]ChangePasswordRequest model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                var pb = new ModelStateBuilder<object>(this);
                pb.SetFieldError(nameof(model.UserId), ProblemDetailsFieldType.UserNotFound);
                return this.NotFound();
            }

            // Força a confirmação do email pois o usuário pode ter acabado de criar a conta
            // mas não ter recebido o email de confirmação, sendo assim, ele nunca poderá logar,
            // ele, naturalmente, usará o "esqueci minha senha".
            if (_signInManager.Options.SignIn.RequireConfirmedEmail && !user.EmailConfirmed)
                user.EmailConfirmed = true;

            var identityResult = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);

            if (!identityResult.Succeeded)
            {
                var pb = new ModelStateBuilder<ChangePasswordRequest>(this, identityResult)
                    .SetIdentityErrorPassword(e => e.Password)
                    .SetIdentityErrorCode(e => e.Code);

                return this.BadRequest();
            }

            return Ok();
        }

        // POST api/externalauth/facebook
        [HttpPost("LoginFacebook")]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LoginFacebook([FromBody]LoginFacebookRequest model)
        {
            var client = new HttpClient();

            // 1. generate an app access token
            var appAccessTokenResponse = await client.GetStringAsync($"https://graph.facebook.com/oauth/access_token?client_id={_appConfig.Facebook.AppId}&client_secret={_appConfig.Facebook.AppSecret}&grant_type=client_credentials");
            var appAccessToken = JsonConvert.DeserializeObject<FacebookAppAccessToken>(appAccessTokenResponse);

            // 2. validate the user access token
            var userAccessTokenValidationResponse = await client.GetStringAsync($"https://graph.facebook.com/debug_token?input_token={model.AccessToken}&access_token={appAccessToken.AccessToken}");
            var userAccessTokenValidation = JsonConvert.DeserializeObject<FacebookUserAccessTokenValidation>(userAccessTokenValidationResponse);

            if (userAccessTokenValidation?.Data?.IsValid == false)
            {
                var pb = new ModelStateBuilder<LoginFacebookRequest>(this)
                    .SetFieldError(e => e.AccessToken, ProblemDetailsFieldType.Invalid, "Invalid facebook token.");
                return this.BadRequest();
            }

            // 3. we've got a valid token so we can request user data from fb
            var userInfoResponse = await client.GetStringAsync($"https://graph.facebook.com/v2.8/me?fields=id,email,first_name,last_name,name,gender,locale,birthday,picture&access_token={model.AccessToken}");
            var userInfo = JsonConvert.DeserializeObject<FacebookUserData>(userInfoResponse);

            // 4. ready to create the local user account (if necessary) and jwt
            var user = await _userManager.FindByEmailAsync(userInfo.Email);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    FirstName = userInfo.FirstName,
                    LastName = userInfo.LastName,
                    FacebookId = userInfo.Id,
                    Email = userInfo.Email,
                    UserName = userInfo.Email,
                    PictureUrl = userInfo.Picture.Data.Url,
                    // LockoutEnabled = false // verificar amanha
                };

                var result = await _userManager.CreateAsync(user);

                if (!result.Succeeded)
                {
                    var pb = new ModelStateBuilder<LoginFacebookRequest>(this)
                        .SetFieldError(e => e.AccessToken, ProblemDetailsFieldType.Invalid, "Invalid facebook token.");
                    return this.BadRequest();
                }
            }

            // 5. generate the jwt for the local user...
            var token = await LoginResponse.GenerateWithTokenAsync(_jwtFactory, _appConfig, user);
            if (token == null)
            {
                var pb = new ModelStateBuilder<LoginRequest>(this);
                pb.SetFieldError(f => f.UserName, ProblemDetailsFieldType.JwtError);
                return this.BadRequest();
            }
            else
            {
                token.RequiresTwoFactor = false;
                return this.Ok(token);
            }
        }
    }
}
