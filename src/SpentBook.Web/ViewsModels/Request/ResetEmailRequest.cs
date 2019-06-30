using FluentValidation;
using SpentBook.Web.Services.Error;

namespace SpentBook.Web.ViewsModels
{
    public class ResetEmailRequest
    {
        public string Email { get; set; }
        public string UrlCallbackConfirmation { get; set; }
    }

    public class ResetEmailRequestValidator : AbstractValidator<ResetEmailRequest>
    {
        public ResetEmailRequestValidator()
        {
            RuleFor(vm => vm.Email)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "E-mail cannot be empty")
                .EmailAddress().WithMessage(ProblemDetailsFieldType.Email, "Invalid e-mail")
                .MinimumLength(5).WithMessage(ProblemDetailsFieldType.MinLength, "E-mail is too short")
                .MaximumLength(100).WithMessage(ProblemDetailsFieldType.MaxLength, "E-mail is too long");

            RuleFor(vm => vm.UrlCallbackConfirmation)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "UrlCallbackConfirmation cannot be empty")
                .MaximumLength(5000).WithMessage(ProblemDetailsFieldType.MaxLength, "UrlCallbackConfirmation is too long");
        }
    }
}
