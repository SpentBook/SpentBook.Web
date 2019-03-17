using System;
using FluentValidation;
using SpentBook.Web.Error;

namespace SpentBook.Web.ViewsModels
{
    public class RegistrationViewModel
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

    public class RegistrationViewModelValidator : AbstractValidator<RegistrationViewModel>
    {
        public RegistrationViewModelValidator()
        {
            RuleFor(vm => vm.Email)
                .NotEmpty().WithMessage("E-mail cannot be empty").WithErrorCode(ProblemDetailFieldType.Required.ToString())
                .EmailAddress().WithMessage("Invalid e-mail").WithErrorCode(ProblemDetailFieldType.InvalidEmail.ToString())
                .MinimumLength(3).WithMessage("E-mail is too short").WithErrorCode(ProblemDetailFieldType.MaxLength.ToString())
                .MaximumLength(100).WithMessage("E-mail is too long").WithErrorCode(ProblemDetailFieldType.MinLength.ToString());

            RuleFor(vm => vm.Password)
                .NotEmpty().WithMessage("Password cannot be empty").WithErrorCode(ProblemDetailFieldType.Required.ToString())
                .MinimumLength(3).WithMessage("Password is too short").WithErrorCode(ProblemDetailFieldType.MinLength.ToString())
                .MaximumLength(20).WithMessage("Password is too long").WithErrorCode(ProblemDetailFieldType.MaxLength.ToString());

            RuleFor(vm => vm.PasswordConfirm)
                .NotEmpty().WithMessage("Password confirmation cannot be empty").WithErrorCode(ProblemDetailFieldType.Required.ToString())
                .Equal(vm => vm.Password).WithMessage("Passwords do not match").WithErrorCode(ProblemDetailFieldType.PasswordNotMatch.ToString())
                .MinimumLength(3).WithMessage("Password confirmation is too short").WithErrorCode(ProblemDetailFieldType.MinLength.ToString())
                .MaximumLength(20).WithMessage("Password confirmation is too long").WithErrorCode(ProblemDetailFieldType.MaxLength.ToString());

            RuleFor(vm => vm.FirstName)
                .NotEmpty().WithMessage("First name cannot be empty").WithErrorCode(ProblemDetailFieldType.Required.ToString())
                .MinimumLength(2).WithMessage("First name is too short").WithErrorCode(ProblemDetailFieldType.MinLength.ToString())
                .MaximumLength(50).WithMessage("First name is too long").WithErrorCode(ProblemDetailFieldType.MaxLength.ToString());
            
            RuleFor(vm => vm.LastName)
                .NotEmpty().WithMessage("Last name cannot be empty").WithErrorCode(ProblemDetailFieldType.Required.ToString())
                .MinimumLength(2).WithMessage("Last name is too short").WithErrorCode(ProblemDetailFieldType.MaxLength.ToString())
                .MaximumLength(50).WithMessage("Last name is too long").WithErrorCode(ProblemDetailFieldType.MaxLength.ToString());

            RuleFor(vm => vm.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth cannot be empty").WithErrorCode(ProblemDetailFieldType.Required.ToString())
                .Must(date => date != default(DateTime)).WithMessage("Date of birth is invalid").WithErrorCode(ProblemDetailFieldType.InvalidDate.ToString());
             
            //  RuleFor(vm => vm.Location)
            //     .NotEmpty().WithMessage("Email cannot be empty")
            //     .EmailAddress().WithMessage("Invalid e-mail")
            //     .MinimumLength(3).WithMessage("E-mail is too short")
            //     .MaximumLength(100).WithMessage("E-mail is too long");
        }
    }
}
