export class ProblemDetails {
    errors: { [id: string]: ProblemDetailsItem; };
    type: ProblemDetailsFieldType;
    title: string;
    status: number;
    detail: string;
    instance: string;
}

export class ProblemDetailsItem {
    type: ProblemDetailsFieldType;
    message: string;
}

export enum ProblemDetailsFieldType {
    Unknown = "Unknown",
    Invalid = "Invalid",
    Required = "Required",
    JwtError = "JwtError",
    IsLockedOut = "IsLockedOut",
    IsNotAllowed = "IsNotAllowed",
    UserNotFound = "UserNotFound",
    MinLength = "MinLength",
    MaxLength = "MaxLength",
    PasswordNotMatch = "PasswordNotMatch",
    PasswordRequiresLower = "PasswordRequiresLower",
    PasswordRequiresUpper = "PasswordRequiresUpper",
    PasswordRequiresNonAlphanumeric = "PasswordRequiresNonAlphanumeric",
    DuplicateUserName = "DuplicateUserName",
    Email = "Email",
    ConfirmEmailError = "ConfirmEmailError",
    ChangePasswordError = "ChangePasswordError",
    UserUpdateError = "UserUpdateError",
    UserDeleteError = "UserDeleteError",
}
