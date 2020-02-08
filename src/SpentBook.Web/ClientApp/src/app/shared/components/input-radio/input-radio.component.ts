// Angular
import { Component, OnInit, Input, ContentChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MatError } from '@angular/material';

// Module
import { ServerSideValidationService } from '../../services/server-side-validation.service';

export class RadioValue {
  value: string;
  text: string;
}

@Component({
  selector: 'app-input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.styl']
})
export class InputRadioComponent implements OnInit {
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  @ContentChildren(MatError, { read: ElementRef })
  _matErrors: QueryList<ElementRef>;

  @Input()
  required: boolean = true;

  @Input()
  submitted: boolean = false;

  @Input()
  values: RadioValue[];

  @Input()
  minLength: number = 3;

  @Input()
  maxLength: number = 30;

  @Input()
  placeholder: String = "";

  @Input()
  formControlRef: FormControl;

  constructor(private serverSideValidate: ServerSideValidationService) {

  }

  ngOnInit(): void {
    let validations: ValidatorFn[] = [];
    if (this.required)
      validations.push(Validators.required);

    this.formControlRef.setValidators(validations);
  }

  hasError(errorName: string) {
    if (this.submitted) {
      return this.serverSideValidate.hasError(this.formControlRef, errorName);
    }
  }

}
