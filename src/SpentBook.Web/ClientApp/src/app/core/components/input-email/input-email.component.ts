import { Component, OnInit, ContentChild, ViewChild, AfterContentInit, Input, ContentChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  @Input()
  formControl: FormControl;

  @ContentChildren(MatError, { read: ElementRef })
  _matErrors: QueryList<ElementRef>;

  constructor(private serverSideValidate: ServerSideValidationService) { }

  ngOnInit() {
    // Por algum motivo, projetar apenas input para dentro do mat-input não funciona
    // É necessário esse fix para forçar o mat-input a conhecer o elemento externo.
    this._matFormField._control = this._control;
  }

  ngAfterContentInit(): void {
  }

  hasErr(errorName: string) {
    return this.serverSideValidate.hasError(this.formControl, errorName);
  }
}
