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
    // [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppConfig _appConfig;
        private readonly EmailService _emailService;

        // private readonly IEmailSender _emailSender;
        // private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        private readonly ApplicationDbContext _appDbContext;
        private readonly IMapper _mapper;

        public UserController(
            UserManager<ApplicationUser> userManager,
            IMapper mapper,
            ILoggerFactory loggerFactory,
            SignInManager<ApplicationUser> signInManager,
            AppConfig appConfig,
            EmailService emailService
        )
        {
            _userManager = userManager;
            _mapper = mapper;            
            _logger = loggerFactory.CreateLogger<UserController>();
            _signInManager = signInManager;
            _appConfig = appConfig;
            _emailService = emailService;
        }

        // POST api/user/add
        [HttpPost("add")]
        public async Task<IActionResult> Post([FromBody]RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var user = new ApplicationUser();
            user.UserName = model.Email;
            user.Email = model.Email;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            var result = await _signInManager.UserManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));

            // Register as locked if enabled
            // if (_appConfig.NewUserAsLocked)

            if (_signInManager.Options.SignIn.RequireConfirmedEmail)
            {
                // var lockoutEndDate = new DateTime(2999,01,01);
                // await _userManager.SetLockoutEnabledAsync(userIdentity, true);
                // await  _userManager.SetLockoutEndDateAsync(userIdentity, lockoutEndDate);
                
                _emailService.ConfirmRegister(model.UrlCallbackConfirmation, user);
            }

            return new OkObjectResult("Account created");
        }
    }
}
