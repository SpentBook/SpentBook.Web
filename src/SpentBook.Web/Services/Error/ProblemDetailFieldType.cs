namespace SpentBook.Web.Error
{
    public enum ProblemDetailFieldType
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
    }
}