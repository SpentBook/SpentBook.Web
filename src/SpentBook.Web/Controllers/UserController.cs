using System;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using SpentBook.Web.Config;
using SpentBook.Web.Email;
using SpentBook.Web.Jwt;
using SpentBook.Web.ViewsModels;

namespace SpentBook.Web.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
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

        // POST api/user
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ErrorViewModel(this));

            /// TODO: MOVER PARA VALIDATION
            if (model.Password != model.ConfirmPassword)
                return BadRequest(new ErrorViewModel(this, ErrorType.PasswordNotMatch));

            var user = new ApplicationUser();
            user.UserName = model.Email;
            user.Email = model.Email;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            var identityResult = await _signInManager.UserManager.CreateAsync(user, model.Password);

            if (!identityResult.Succeeded)
               return BadRequest(new ErrorViewModel(this, identityResult, ErrorType.AddUserError));

            // Register as locked if enabled
            // if (_appConfig.NewUserAsLocked)

            if (_signInManager.Options.SignIn.RequireConfirmedEmail)
            {
                // var lockoutEndDate = new DateTime(2999,01,01);
                // await _userManager.SetLockoutEnabledAsync(userIdentity, true);
                // await  _userManager.SetLockoutEndDateAsync(userIdentity, lockoutEndDate);

                _emailService.ConfirmRegister(model.UrlCallbackConfirmation, user);
            }
            
            // Return token to auto login
            var token = await TokenViewModel.GenerateAsync(_jwtFactory, _appConfig, user.Id, user.UserName);
            if (token == null)
                return BadRequest(new ErrorViewModel(this, ErrorType.JwtError));
            return new OkObjectResult(token);
        }

        // PUT api/user
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Put([FromBody]RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ErrorViewModel(this));

            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
                return BadRequest(new ErrorViewModel(this, ErrorType.UserNotFound));
            
            user.Email = model.Email;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            var identityResult = await _signInManager.UserManager.UpdateAsync(user);

            if (!identityResult.Succeeded)
                return BadRequest(new ErrorViewModel(this, identityResult, ErrorType.UserUpdateError));

            return new EmptyResult();
        }

        // GET api/user
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get(string userId)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(userId))
                return BadRequest(new ErrorViewModel(this));

            var user = await _signInManager.UserManager.FindByIdAsync(userId);
            if (user == null)
                return BadRequest(new ErrorViewModel(this, ErrorType.UserNotFound));

            return new OkObjectResult(user);
        }

        // DELETE api/user
        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(string userId)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(userId))
                return BadRequest(new ErrorViewModel(this));

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return BadRequest(new ErrorViewModel(this, ErrorType.UserNotFound));

            var identityResult = await _signInManager.UserManager.DeleteAsync(user);

            if (!identityResult.Succeeded)
                return BadRequest(new ErrorViewModel(this, identityResult, ErrorType.UserDeleteError));

            return new EmptyResult();
        }
    }
}
