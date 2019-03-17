// import { Directive, forwardRef, Attribute, Input } from '@angular/core';
// import { NG_VALIDATORS, Validator, AbstractControl, FormControl } from '@angular/forms';

// @Directive({
//     selector: '[fieldMatch]',
//     providers: [
//         { provide: NG_VALIDATORS, useExisting: forwardRef(() => FieldMatchValidatorDirective), multi: true }
//     ]
// })
// export class FieldMatchValidatorDirective implements Validator {
//     @Input('fieldMatch') fieldMatch: FormControl;

//     validate(c: AbstractControl): { [key: string]: any } {
//         // self value (e.g. retype password)
//         let v = c.value;

//         // value not equal
//         if (this.fieldMatch && v !== this.fieldMatch.value) return {
//             fieldMatch: true
//         }
//         return null;
//     }
// }