// Angular
import { Component, Input, OnInit, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';

// Material
import { MatError } from '@angular/material/form-field';

// Touch
import 'hammerjs';

// Module
import { ServerSideValidationService } from '../../services/server-side-validation.service';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.styl'],
})
export class InputPasswordComponent implements OnInit {
  showPwd: boolean = false;
  
  @ContentChildren(MatError, { read: ElementRef })
  _matErrors: QueryList<ElementRef>;

  @Input()
  required: boolean = true;

  @Input()
  minLength: number = 3;

  @Input()
  maxLength: number = 30;

  @Input()
  placeholder: String = "Senha";

  @Input()
  formControlRef: FormControl;

  @Input()
  isConfirmation: boolean = false;

  constructor(private serverSideValidate: ServerSideValidationService) {

  }

  ngOnInit(): void {
    let validations: ValidatorFn[] = [];
    if (this.required)
      validations.push(Validators.required);

    if (!this.isConfirmation) {
      validations.push(Validators.minLength(this.minLength));
      validations.push(Validators.maxLength(this.maxLength));
    }

    this.formControlRef.setValidators(validations);
  }

  hasError(errorName: string) {
    return this.serverSideValidate.hasError(this.formControlRef, errorName);
  }
}