// using FluentValidation.Attributes;

using FluentValidation;
using SpentBook.Web.Services.Error;

namespace SpentBook.Web.ViewsModels
{
    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
             RuleFor(vm => vm.UserName)
                .NotEmpty().WithMessage("E-mail cannot be empty").WithErrorCode(ProblemDetailsFieldType.Required.ToString())
                .EmailAddress().WithMessage("Invalid e-mail").WithErrorCode(ProblemDetailsFieldType.Email.ToString())
                .MinimumLength(3).WithMessage("E-mail is too short").WithErrorCode(ProblemDetailsFieldType.MaxLength.ToString())
                .MaximumLength(100).WithMessage("E-mail is too long").WithErrorCode(ProblemDetailsFieldType.MinLength.ToString());

            RuleFor(vm => vm.Password)
                .NotEmpty().WithMessage("Password cannot be empty").WithErrorCode(ProblemDetailsFieldType.Required.ToString())
                .MinimumLength(3).WithMessage("Password is too short").WithErrorCode(ProblemDetailsFieldType.MinLength.ToString())
                .MaximumLength(20).WithMessage("Password is too long").WithErrorCode(ProblemDetailsFieldType.MaxLength.ToString());
        }
    }
}
