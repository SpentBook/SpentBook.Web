// angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// touch
import 'hammerjs';

// reactive
import { timer, Observable } from 'rxjs';

// models
import { AuthService } from '../../services/auth.service';
import { Token } from 'src/app/core/models/token.model';
import { UserRegister } from 'src/app/core/models/user.register.model';
import { CustomValidations } from 'src/app/core/validations/custom-validations';
import { ServerSideValidationService, FieldError } from 'src/app/core/services/server-side-validation.service';
import { ProblemDetails } from 'src/app/core/models/problem-details.model';
import { BoxErrorComponent } from 'src/app/core/components/box-error/box-error.component';

// // date
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import { Moment } from 'moment';
// import { MomentDateAdapter } from '@angular/material-moment-adapter';

/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

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
  // providers: [
  //   { provide: DateAdapter, useClass: CustomMomentDateAdapter  },
  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  // ]
})
export class RegisterComponent implements OnInit {
  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  form: FormGroup;
  loading: boolean = false;
  register$: Observable<Token>;
  returnUrl: string;

  get email(): any { return this.form.get('email'); }
  get firstName(): any { return this.form.get('firstName'); }
  get lastName(): any { return this.form.get('lastName'); }
  get password(): any { return this.form.get('passwordGroup').get('password'); }
  get passwordConfirm(): any { return this.form.get('passwordGroup').get('passwordConfirm'); }
  get dateOfBirth(): any { return this.form.get('dateOfBirth'); }

  teste: string;
  disabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private serverSideValidate: ServerSideValidationService,
    private router: Router
  ) {
    this.createForm();
    this.returnUrl = 'home';

  }

  ngOnInit() {

  }

  private createForm() {
    this.form = this.fb.group({
      'email': [''],
      'firstName': [''],
      'lastName': [''],
      'dateOfBirth': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'passwordGroup': this.fb.group({
        'password': new FormControl({value: '', disabled: false}, Validators.compose([Validators.required, Validators.minLength(2)])),
        'passwordConfirm': ['', Validators.compose([Validators.required])]
      }, {
          validator: CustomValidations.passwordMatchValidator('passwordConfirm', 'password')
        }),
    });
  }

  hasError(control: FormControl, errorName: string) {
    return this.serverSideValidate.hasError(control, errorName);
  }

  hiddenError(control: FormControl, errorName: string) {
    return this.serverSideValidate.hiddenError(control, errorName);
  }

  submitForm() {
    if (!this.form.valid) {
      //return;
    }

    this.loading = true;

    timer(2000).subscribe(() => {
      let user = new UserRegister();
      user.email = this.email.value;
      user.firstName = this.firstName.value;
      user.lastName = this.lastName.value;
      user.password = this.password.value;
      user.passwordConfirm = this.passwordConfirm.value;
      user.dateOfBirth = this.dateOfBirth.value;

      this.register$ = this.authService.register(user);
      this.register$.subscribe(
        () => {
          this.loading = false;
          this.router.navigateByUrl(this.returnUrl);
        },
        error => {
          this.loading = false;
          this.serverSideValidate.validateWithBoxError(this, error, this.boxError);
        }
      );
    });


    var seconds = new Date().getTime() / 1000;
    this.teste = seconds.toString();
  }

  backRegister() {
    this.boxError.show = false;
  }
}
