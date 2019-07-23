using System;
using FluentValidation;
using SpentBook.Web.Services.Error;

namespace SpentBook.Web.ViewsModels.Validations
{
    public class UserValidator : AbstractValidator<ApplicationUser>
    {
        public UserValidator()
        {
            // RuleFor(vm => vm.Email)
            //     .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "E-mail cannot be empty")
            //     .EmailAddress().WithMessage(ProblemDetailsFieldType.Email, "Invalid e-mail")
            //     .MinimumLength(5).WithMessage(ProblemDetailsFieldType.MinLength, "E-mail is too short")
            //     .MaximumLength(100).WithMessage(ProblemDetailsFieldType.MaxLength, "E-mail is too long");

            RuleFor(vm => vm.FirstName)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "First name cannot be empty")
                .MinimumLength(2).WithMessage(ProblemDetailsFieldType.MinLength, "First name is too short")
                .MaximumLength(50).WithMessage(ProblemDetailsFieldType.MaxLength, "First name is too long");

            RuleFor(vm => vm.LastName)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "Last name cannot be empty")
                .MinimumLength(2).WithMessage(ProblemDetailsFieldType.MinLength, "Last name is too short")
                .MaximumLength(50).WithMessage(ProblemDetailsFieldType.MaxLength, "Last name is too long");

            RuleFor(vm => vm.DateOfBirth)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "Date of birth cannot be empty")
                .Must(date => date != default(DateTime)).WithMessage(ProblemDetailsFieldType.Invalid, "Date of birth is invalid");

            RuleFor(vm => vm.Gender)
                .Must(sex =>
                {
                    return sex == Gender.Female || sex == Gender.Male;
                }).WithMessage(ProblemDetailsFieldType.Invalid, "Gender is invalid");
        }
    }
}