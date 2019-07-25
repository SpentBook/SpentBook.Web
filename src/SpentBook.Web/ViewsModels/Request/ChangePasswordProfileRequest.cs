using FluentValidation;
using SpentBook.Web.Services.Error;

namespace SpentBook.Web.ViewsModels
{
    public class ChangePasswordProfileRequest
    {
        public string PasswordCurrent { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
    }

    public class ChangePasswordProfileRequestValidator : AbstractValidator<ChangePasswordProfileRequest>
    {
        public ChangePasswordProfileRequestValidator()
        {
            RuleFor(vm => vm.PasswordCurrent)
                // .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "PasswordCurrent cannot be empty")
                // .MinimumLength(3).WithMessage(ProblemDetailsFieldType.MinLength, "PasswordCurrent is too short")
                .MaximumLength(20).WithMessage(ProblemDetailsFieldType.MaxLength, "PasswordCurrent is too long");

            RuleFor(vm => vm.Password)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "Password cannot be empty")
                .MinimumLength(3).WithMessage(ProblemDetailsFieldType.MinLength, "Password is too short")
                .MaximumLength(20).WithMessage(ProblemDetailsFieldType.MaxLength, "Password is too long");

            RuleFor(vm => vm.PasswordConfirm)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "Password confirmation cannot be empty")
                .Equal(vm => vm.Password).WithMessage(ProblemDetailsFieldType.PasswordNotMatch, "Passwords do not match")
                .MinimumLength(3).WithMessage(ProblemDetailsFieldType.MinLength, "Password confirmation is too short")
                .MaximumLength(20).WithMessage(ProblemDetailsFieldType.MaxLength, "Password confirmation is too long");
        }
    }
}