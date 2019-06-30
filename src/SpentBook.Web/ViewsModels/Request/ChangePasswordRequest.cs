using FluentValidation;
using SpentBook.Web.Services.Error;

namespace SpentBook.Web.ViewsModels
{
    public class ChangePasswordRequest
    {
        public string UserId { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
        public string Code { get; set; }
    }

    public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
    {
        public ChangePasswordRequestValidator()
        {
            RuleFor(vm => vm.UserId)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "UserId cannot be empty")
                .MaximumLength(100).WithMessage(ProblemDetailsFieldType.MaxLength, "UserId is too long");

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