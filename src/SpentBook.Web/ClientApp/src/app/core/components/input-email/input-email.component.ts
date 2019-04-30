import { Component, OnInit, ContentChild, ViewChild, AfterContentInit, Input, ContentChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ServerSideValidationService } from '../../services/server-side-validation.service';

// touch
import 'hammerjs';

// Material
import { MatFormFieldControl, MatFormField, MatError } from '@angular/material';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.styl']
})
export class InputEmailComponent implements OnInit, AfterContentInit {

  @ViewChild(MatFormField)
  _matFormField: MatFormField;

  @ContentChild(MatFormFieldControl)
  _control: MatFormFieldControl<any>;

    @ContentChild(MatFormFieldControl, { read: ElementRef } )
  _input: ElementRef;

  @ContentChildren(MatError, { read: ElementRef })
  _matErrors: QueryList<ElementRef>;

  @Input()
  formControlRef: FormControl;

  @Input()
  required: boolean = true;

  @Input()
  minLength: number = 5;

  @Input()
  maxLength: number = 100;

  // Devido a limitações do angular, o nome padrão do componente deve ser definido aqui
  // mas deve ser usado no placeholder de quem usa o componente
  public placeholder: string = "E-mail";

  constructor(private serverSideValidate: ServerSideValidationService) { }

  ngOnInit() {
    // Por algum motivo, projetar apenas input para dentro do mat-input não funciona
    // É necessário esse fix para forçar o mat-input a conhecer o elemento externo.
    this._matFormField._control = this._control;
    let validations : ValidatorFn[] = [];

    // add validations
    if (this.required)
      validations.push(Validators.required);

    validations.push(Validators.email);
    validations.push(Validators.minLength(this.minLength));
    validations.push(Validators.maxLength(this.maxLength));
    this.formControlRef.setValidators(validations);
    
    // change native input
    this._input.nativeElement.setAttribute('maxlength', this.maxLength);
    this._input.nativeElement.setAttribute('autocomplete', 'off');
    // this._input.nativeElement.setAttribute('placeholder', this.placeholder);
    // this._input.nativeElement.placeholder = this.placeholder;
  }

  ngAfterContentInit(): void {
  }

  hiddenError(errorName: string) {
    return this.serverSideValidate.hiddenError(this.formControlRef, errorName);
  }
}
