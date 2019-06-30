using System;
using FluentValidation;
using SpentBook.Web.Services.Error;

namespace SpentBook.Web.ViewsModels
{
    public class RegistrationRequest
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
        public string FirstName { get; set; }
        public DateTime DateOfBirth { get;  set; }
        public string LastName { get; set; }
        public string Location { get; set; }
        public string UrlCallbackConfirmation { get; set; }
    }

    public class RegistrationRequestValidator : AbstractValidator<RegistrationRequest>
    {
        public RegistrationRequestValidator()
        {
            RuleFor(vm => vm.Email)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "E-mail cannot be empty")
                .EmailAddress().WithMessage(ProblemDetailsFieldType.Email, "Invalid e-mail")
                .MinimumLength(5).WithMessage(ProblemDetailsFieldType.MinLength, "E-mail is too short")
                .MaximumLength(100).WithMessage(ProblemDetailsFieldType.MaxLength, "E-mail is too long");

            RuleFor(vm => vm.Password)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "Password cannot be empty")
                .MinimumLength(3).WithMessage(ProblemDetailsFieldType.MinLength, "Password is too short")
                .MaximumLength(20).WithMessage(ProblemDetailsFieldType.MaxLength, "Password is too long");

            RuleFor(vm => vm.PasswordConfirm)
                .NotEmpty().WithMessage(ProblemDetailsFieldType.Required, "Password confirmation cannot be empty")
                .Equal(vm => vm.Password).WithMessage(ProblemDetailsFieldType.PasswordNotMatch, "Passwords do not match")
                .MinimumLength(3).WithMessage(ProblemDetailsFieldType.MinLength, "Password confirmation is too short")
                .MaximumLength(20).WithMessage(ProblemDetailsFieldType.MaxLength, "Password confirmation is too long");

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
        }
    }
}
