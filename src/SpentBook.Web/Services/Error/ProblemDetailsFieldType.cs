namespace SpentBook.Web.Error
{
    public enum ProblemDetailsFieldType
    {
        Unknown,
        JwtError,
        InvalidForm,
        IsLockedOut,
        IsNotAllowed,
        UserNotFound,
        MinLength,
        MaxLength,
        PasswordNotMatch,
        Required,
        PasswordRequiresLower,
        PasswordRequiresUpper,
        PasswordRequiresNonAlphanumeric,
        DuplicateUserName,
        InvalidEmail,
        InvalidDate,
        Invalid,
    }
}