import { Component, OnInit, ContentChild, ViewChild, AfterContentInit, Input, ContentChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ServerSideValidationService } from '../../services/server-side-validation.service';

// touch
import 'hammerjs';

// Material
import { MatFormFieldControl, MatFormField, MatError } from '@angular/material';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.styl']
})
export class InputPasswordComponent implements OnInit {

  @ViewChild(MatFormField)
  _matFormField: MatFormField;

  @ContentChild(MatFormFieldControl)
  _control: MatFormFieldControl<any>;

  @ContentChild(MatFormFieldControl, { read: ElementRef })
  _input: ElementRef;

  @ContentChildren(MatError, { read: ElementRef })
  _matErrors: QueryList<ElementRef>;

  @Input()
  formControlRef: FormControl;

  @Input()
  required: boolean = true;

  @Input()
  minLength: number = 3;

  @Input()
  maxLength: number = 20;

  // Recupera o nome do campo
  placeholder: string;

  constructor(private serverSideValidate: ServerSideValidationService) { }

  ngOnInit() {
    // Por algum motivo, projetar apenas input para dentro do mat-input não funciona
    // É necessário esse fix para forçar o mat-input a conhecer o elemento externo.
    this._matFormField._control = this._control;
    let validations: ValidatorFn[] = [];

    // add validations
    if (this.required)
      validations.push(Validators.required);

    validations.push(Validators.minLength(this.minLength));
    validations.push(Validators.maxLength(this.maxLength));
    this.formControlRef.setValidators(validations);

    // change native input
    this._input.nativeElement.setAttribute('maxlength', this.maxLength);
    this._input.nativeElement.setAttribute('autocomplete', 'off');
    this.placeholder = this._input.nativeElement.getAttribute('placeholder');
  }

  ngAfterContentInit(): void {

  }

  hiddenError(errorName: string) {
    return this.serverSideValidate.hiddenError(this.formControlRef, errorName);
  }
}

