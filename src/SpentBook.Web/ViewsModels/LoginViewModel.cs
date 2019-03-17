// using FluentValidation.Attributes;

using FluentValidation;
using SpentBook.Web.Error;

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
             RuleFor(vm => vm.UserName)
                .NotEmpty().WithMessage("E-mail cannot be empty").WithErrorCode(ProblemDetailFieldType.Required.ToString())
                .EmailAddress().WithMessage("Invalid e-mail").WithErrorCode(ProblemDetailFieldType.InvalidEmail.ToString())
                .MinimumLength(3).WithMessage("E-mail is too short").WithErrorCode(ProblemDetailFieldType.MaxLength.ToString())
                .MaximumLength(100).WithMessage("E-mail is too long").WithErrorCode(ProblemDetailFieldType.MinLength.ToString());

            RuleFor(vm => vm.Password)
                .NotEmpty().WithMessage("Password cannot be empty").WithErrorCode(ProblemDetailFieldType.Required.ToString())
                .MinimumLength(3).WithMessage("Password is too short").WithErrorCode(ProblemDetailFieldType.MinLength.ToString())
                .MaximumLength(20).WithMessage("Password is too long").WithErrorCode(ProblemDetailFieldType.MaxLength.ToString());
        }
    }
}
