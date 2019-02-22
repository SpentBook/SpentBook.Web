import { ApiErrorType } from "./api-error-type.enum";

export class ApiError
{
    validations: { [id: string] : ApiErrorField; };
    errorType: ApiErrorType;
    requestId: string;
    message: string
}

export class ApiErrorField
{
    rawValue: string;
    attemptedValue: string;
    validationState: ApiValidationState;
    children: ApiErrorField[];
    errors: ApiException[];
}

export enum ApiValidationState
{
    Unvalidated = 0,
    Invalid = 1,
    Valid = 2,
    Skipped = 3
}

export class ApiException
{
    exception: any;
    errorMessage: string;
}

