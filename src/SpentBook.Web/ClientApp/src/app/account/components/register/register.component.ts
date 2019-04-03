// angular
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatDateFormats } from '@angular/material/core';
import { Router } from '@angular/router';

// date
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

// touch
import 'hammerjs';

// reactive
import { timer, Observable } from 'rxjs';

// models
import { AuthService } from '../../services/auth.service';
import { Token } from 'src/app/core/models/token.model';
import { ProblemDetails, ProblemDetailsFieldType } from 'src/app/core/models/problem-details.model';
import { UserRegister } from 'src/app/core/models/user.register.model';
import { inherits } from 'util';
import { baseDirectiveCreate } from '@angular/core/src/render3/instructions';
import { CustomValidations } from 'src/app/core/validations/custom-validations';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/*
1) Criar "Declaro estar ciente" e salvar termo assinado (ler mais sobre)
2) Apagar imports não usados
3) Validações cliente side
4) Senha como passowrd
5) Subir imagem do usuário
6) Cadastro multi-step
7) Erro server side
8) Mascaras
9) O auto complete do browser zoa todo o layout do input
8) Enter deve mudar d campo
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
  form: FormGroup;
  loading: boolean = false;
  showError: boolean = false;
  register$: Observable<Token>;
  returnUrl: string;
  errorMessage: string;

  get email(): any { return this.form.get('email'); }
  get name(): any { return this.form.get('name'); }
  get lastName(): any { return this.form.get('lastName'); }
  get password(): any { return this.form.get('passwordGroup').get('password'); }
  get passwordConfirm(): any { return this.form.get('passwordGroup').get('passwordConfirm'); }
  get dateOfBirth(): any { return this.form.get('dateOfBirth'); }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group(
      {
        'email': ['', Validators.compose([Validators.required, Validators.email])],
        'name': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        'lastName': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        'dateOfBirth': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
        'passwordGroup': this.fb.group({
          'password': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
          'passwordConfirm': ['', Validators.compose([Validators.required])]
        },
          {
            validator: CustomValidations.passwordMatchValidator('passwordConfirm', 'password')
          }),
      }
    );

    this.returnUrl = 'home';
  }

  ngOnInit() {

  }

  public hasError = (control: FormControl, errorName: string) => {
    return control.hasError(errorName);
  }

  submitForm() {
    if (!this.form.valid) {
      //return;
    }

    this.loading = true;

    timer(2000).subscribe(() => {
      let user = new UserRegister();
      user.email = this.email.value;
      user.firstName = this.name.value;
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
          this.validatePosSubmit(error);
        }
      );
    });
  }
  
  backRegister() {
    this.showError = false;
  }

  private validatePosSubmit(error: any) {
    var problemDetails = <ProblemDetails>error.error;
    for (let fieldName in problemDetails.errors) {
      let field = this[this.toLowerCaseFirstLetter(fieldName)];
      if (field == null) {
        this.showError = true;
        this.errorMessage = "Ocorreu um erro inesperado, tente novamente mais tarde";
      }
      else {
        var fieldErrors = problemDetails.errors[fieldName];
        var errors = {};
        for (let index in fieldErrors) {
          let e = fieldErrors[index];
          errors[this.toLowerCaseFirstLetter(e.type)] = true;
          // switch (e.type) {
          //   case ProblemDetailsFieldType.InvalidForm:
          //     this.errorMessage = "Existem erros que precisam ser corrigidos ;)";
          //     break;
          //   case ProblemDetailsFieldType.AddUserError:
          //     this.errorMessage = "Erro ao cadastrar usuário (TALVEZ USUARIO EXISTA)";
          //     break;
          //   case ProblemDetailsFieldType.PasswordNotMatch:
          //     this.errorMessage = "O campo senha é diferente da sua confirmação";
          //     break;
          //   default:
          //     this.errorMessage = "Ocorreu um erro inesperado, tente novamente mais tarde";
          // }
        }
        field.setErrors(errors);
      }
    }
  }

  private toLowerCaseFirstLetter(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }
}
