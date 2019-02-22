export enum ApiErrorType {
    JwtError = "JwtError",
    InvalidForm = "InvalidForm",
    IsLockedOut = "IsLockedOut",
    IsNotAllowed = "IsNotAllowed",
    UserNotFound = "UserNotFound",
    ConfirmEmailError = "ConfirmEmailError",
    PasswordNotMatch = "PasswordNotMatch",
    ChangePasswordError = "ChangePasswordError",
    AddUserError = "AddUserError",
    UserUpdateError = "UserUpdateError",
    UserDeleteError = "UserDeleteError",
    Unknown = "Unknown"
}