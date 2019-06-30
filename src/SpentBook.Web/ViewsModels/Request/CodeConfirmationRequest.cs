using FluentValidation;
using SpentBook.Web.Services.Error;

namespace SpentBook.Web.ViewsModels
{
    public class CodeConfirmationRequest
    {
        public string UserId { get; set; }
        public string Code { get; set; }
    }

    public class CodeConfirmationRequestValidator : AbstractValidator<CodeConfirmationRequest>
    {
        public CodeConfirmationRequestValidator()
        {
            RuleFor(vm => vm.UserId)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "UserId cannot be empty")
                .MaximumLength(100).WithMessage(ProblemDetailsFieldType.MaxLength, "UserId is too long");

            RuleFor(vm => vm.Code)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "Code cannot be empty")
                .MaximumLength(1000).WithMessage(ProblemDetailsFieldType.MaxLength, "Code is too long");
        }
    }
}
