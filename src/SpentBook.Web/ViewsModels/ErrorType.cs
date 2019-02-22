namespace SpentBook.Web.ViewsModels
{
    public enum ErrorType
    {
        JwtError,
        InvalidForm,
        IsLockedOut,
        IsNotAllowed,
        UserNotFound,
        ConfirmEmailError,
        PasswordNotMatch,
        ChangePasswordError,
        AddUserError,
        UserUpdateError,
        UserDeleteError,
        Unknown
    }
}