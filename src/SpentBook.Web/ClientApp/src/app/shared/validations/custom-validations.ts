// Angular
import { AbstractControl } from "@angular/forms";

export class CustomValidations {
    // static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    //     return (control: AbstractControl): { [key: string]: any } => {
    //         if (!control.value) {
    //             // if control is empty return no error
    //             return null;
    //         }

    //         // test the value of the control against the regexp supplied
    //         const valid = regex.test(control.value);

    //         // if true, return no error (no error), else return error passed in the second parameter
    //         return valid ? null : error;
    //     };
    // }

    static passwordMatchValidator(field1: string, field2: string) {
        return (control: AbstractControl) => {
            var ctrField1 = control.get(field1);
            var ctrField2 = control.get(field2);
            var errors = ctrField1.errors || {};
            
            if (ctrField1.value && ctrField2.dirty && ctrField1.value !== ctrField2.value) {
                errors['passwordNotMatch'] = true;                
            }
            else {
                delete errors['passwordNotMatch'];
                if (Object.entries(errors).length == 0)
                    errors = null;
            }

            ctrField1.setErrors(errors);
        };
    }
}
