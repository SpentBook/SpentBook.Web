// using FluentValidation.Attributes;

using FluentValidation;

namespace SpentBook.Web.ViewsModels
{
    // [Validator(typeof(CredentialsViewModelValidator))]
    public class LoginViewModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class LoginViewModelValidator : AbstractValidator<LoginViewModel>
    {
        public LoginViewModelValidator()
        {
            RuleFor(vm => vm.UserName).NotEmpty().WithMessage("Username cannot be empty");
            RuleFor(vm => vm.Password).NotEmpty().WithMessage("Password cannot be empty");
            RuleFor(vm => vm.Password).Length(6, 12).WithMessage("Password must be between 6 and 12 characters");
        }
    }
}
