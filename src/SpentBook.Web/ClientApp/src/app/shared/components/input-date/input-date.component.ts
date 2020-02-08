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
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.styl']
})
export class InputDateComponent implements OnInit {
  @ContentChildren(MatError, { read: ElementRef })
  _matErrors: QueryList<ElementRef>;
  
  @Input()
  required: boolean = true;
  
  @Input()
  minLength: number = 10;

  @Input()
  maxLength: number = 19;

  @Input()
  placeholder: String = "Data de nascimento";

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