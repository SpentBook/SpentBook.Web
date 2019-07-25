using System;
using FluentValidation;
using SpentBook.Web.Services.Error;

namespace SpentBook.Web.ViewsModels
{
    public class UnregisterRequest
    {
        public string Password { get; set; }
    }

    public class UnregisterRequestValidator : AbstractValidator<RegistrationRequest>
    {
        public UnregisterRequestValidator()
        {
            RuleFor(vm => vm.Password)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "Password cannot be empty")
                .MinimumLength(3).WithMessage(ProblemDetailsFieldType.MinLength, "Password is too short")
                .MaximumLength(20).WithMessage(ProblemDetailsFieldType.MaxLength, "Password is too long");
        }
    }
}
