namespace SpentBook.Web.Services.Error
{
    public enum ProblemDetailsFieldType
    {
        Unknown,
        Invalid,
        Required,
        JwtError,
        IsLockedOut,
        IsNotAllowed,
        UserNotFound,
        MinLength,
        MaxLength,
        PasswordTooShort,
        PasswordNotMatch,
        PasswordRequiresLower,
        PasswordRequiresUpper,
        PasswordRequiresNonAlphanumeric,
        DuplicateUserName,
        Email,
    }
}