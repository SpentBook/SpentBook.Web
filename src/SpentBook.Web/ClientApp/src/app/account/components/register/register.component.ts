// Angular
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Touch
import 'hammerjs';

// Reactive
import { timer, Observable } from 'rxjs';

// Models
import { AuthService, LoginResult, UserRegister, LoginRequest } from '@app/core';
import { BoxErrorComponent, ServerSideValidationService, CustomValidations } from '@app/shared';
import { PlatformLocation } from '@angular/common';

/*
1) Criar "Declaro estar ciente" e salvar termo assinado (ler mais sobre)
2) Apagar imports não usados
3) Validações cliente side - ok
4) Senha como passowrd - ok
5) Subir imagem do usuário
6) Cadastro multi-step
7) Erro server side
8) Mascaras
9) O auto complete do browser zoa todo o layout do input
8) Enter deve mudar d campo
9) Acertar injeção dos services authservice e apiservice que estão no core, mas sao de outro modulo
*/

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.styl'],
})
export class RegisterComponent implements OnInit, AfterViewChecked {
  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  @Output()
  finish: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  urlCallbackConfirmation: string;

  form: FormGroup;
  loading: boolean = false;
  register$: Observable<LoginResult>;

  get email(): any { return this.form.get('email'); }
  get firstName(): any { return this.form.get('firstName'); }
  get lastName(): any { return this.form.get('lastName'); }
  get password(): any { return this.form.get('passwordGroup').get('password'); }
  get passwordConfirm(): any { return this.form.get('passwordGroup').get('passwordConfirm'); }
  get dateOfBirth(): any { return this.form.get('dateOfBirth'); }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit() {

  }

  ngAfterViewChecked() {
    // Resolve o bug: ExpressionChangedAfterItHasBeenCheckedError: 
    // Expression has changed after it was checked.
    this.cdRef.detectChanges();
  }

  private createForm() {
    this.form = this.fb.group({
      email: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      dateOfBirth: new FormControl(),
      passwordGroup: this.fb.group({
        password: new FormControl(),
        passwordConfirm: new FormControl()
      }, {
          validator: CustomValidations.passwordMatchValidator('passwordConfirm', 'password')
        }),
    });
  }

  submitForm() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    timer(2000).subscribe(() => {
      let userRegister = new UserRegister();
      userRegister.email = this.email.value;
      userRegister.firstName = this.firstName.value;
      userRegister.lastName = this.lastName.value;
      userRegister.password = this.password.value;
      userRegister.passwordConfirm = this.passwordConfirm.value;
      userRegister.dateOfBirth = this.dateOfBirth.value;
      userRegister.urlCallbackConfirmation = this.urlCallbackConfirmation;

      this.register$ = this.authService.register(userRegister);
      this.register$.subscribe(
        (loginResult) => {
          this.loading = false;
          this.finish.emit({ userRegister: userRegister, loginResult: loginResult });
        },
        error => {
          this.loading = false;
          this.serverSideValidate.validateWithBoxError(this, error, this.boxError);
        }
      );
    });
  }

  hideBoxError() {
    this.boxError.show = false;
  }

  // hasError(control: FormControl, errorName: string) {
  //   return this.serverSideValidate.hasError(control, errorName);
  // }

  // hiddenError(control: FormControl, errorName: string) {
  //   return this.serverSideValidate.hiddenError(control, errorName);
  // }
}