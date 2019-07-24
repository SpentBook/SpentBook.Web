type DictionaryItem = { [id: string]: ProblemDetailsItem };

export class ProblemDetails {
    private _errorsAll: DictionaryItem;
    private _errors: DictionaryItem;

    get errors(): DictionaryItem {
        return this._errors;
    }

    set errors(value: DictionaryItem) {
        if (value == null)
            return;

        this._errorsAll = value;
        this._errors = value;
        delete this._errors['*'];
    }

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
    PasswordMismatch,
}
