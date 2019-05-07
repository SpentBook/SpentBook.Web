import { Component, Input, OnInit, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ServerSideValidationService } from '../../services/server-side-validation.service';

// touch
import 'hammerjs';
import { MatError } from '@angular/material';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.styl'],
})
export class InputPasswordComponent implements OnInit {
  @ContentChildren(MatError, { read: ElementRef })
  private _matErrors: QueryList<ElementRef>;
  
  @Input()
  required: boolean = true;
  
  @Input()
  minLength: number = 3;

  @Input()
  maxLength: number = 20;

  @Input()
  placeholder: String = "Senha";

  @Input()
  formControlRef: FormControl;

  constructor(private serverSideValidate: ServerSideValidationService) {

  }

  ngOnInit(): void {
    let validations: ValidatorFn[] = [];
    if (this.required)
      validations.push(Validators.required);

    validations.push(Validators.minLength(this.minLength));
    validations.push(Validators.maxLength(this.maxLength));
    this.formControlRef.setValidators(validations);
  }

  hasError(errorName: string) {
    return this.serverSideValidate.hasError(this.formControlRef, errorName);
  }
}

