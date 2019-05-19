// Angular
import { Component, Input, OnInit, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';

// Material
import { MatError } from '@angular/material';

// Touch
import 'hammerjs';

// Module
import { ServerSideValidationService } from '../../services/server-side-validation.service';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.styl']
})
export class InputEmailComponent implements OnInit {
  @ContentChildren(MatError, { read: ElementRef })
  private _matErrors: QueryList<ElementRef>;
  
  @Input()
  required: boolean = true;
  
  @Input()
  minLength: number = 5;

  @Input()
  maxLength: number = 100;

  @Input()
  placeholder: String = "E-mail";

  @Input()
  formControlRef: FormControl;

  constructor(private serverSideValidate: ServerSideValidationService) {

  }

  ngOnInit(): void {
    let validations: ValidatorFn[] = [];
    if (this.required)
      validations.push(Validators.required);

    validations.push(Validators.email);
    validations.push(Validators.minLength(this.minLength));
    validations.push(Validators.maxLength(this.maxLength));
    this.formControlRef.setValidators(validations);
  }

  hasError(errorName: string) {
    return this.serverSideValidate.hasError(this.formControlRef, errorName);
  }
}