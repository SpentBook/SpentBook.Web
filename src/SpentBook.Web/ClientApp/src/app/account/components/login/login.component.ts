import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiErrorType } from 'src/app/core/models/api-error-type.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiError, ApiValidationState } from 'src/app/core/models/api-error.model';
import { delay, timeout, tap } from 'rxjs/operators';
import { Observable, of, timer, concat, combineLatest } from 'rxjs';
import { Token } from '@angular/compiler';

/*
TODO:
1 - Loading 
2 - Validação client side
3 - Transição
4 - Como ou quando matar o observable ?
5 - Facebook login
6 - multilanguage
7 - Criar botão de cancelar login no loading
8 - Se estiver logado, deve ir para a home
*/

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  isSubmitting = false;
  returnUrl: string;
  showError: boolean;
  errorMessage: string;
  loading: boolean;

  get email(): any { return this.authForm.get('email'); }
  get password(): any { return this.authForm.get('password'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {
  }

  submitForm() {
    this.loading = true;
    timer(2000)
      .subscribe(i => {
        var login$ = this.authService.login(this.email.value, this.password.value)
          .subscribe(
            data => {
              this.loading = false;
              this.router.navigateByUrl(this.returnUrl);
            },
            error => {
              this.loading = false;
              var objError = <ApiError>error.error;
              this.showError = true;

              switch (objError.errorType) {
                case ApiErrorType.UserNotFound:
                case ApiErrorType.InvalidForm:
                  this.errorMessage = "Usuário ou senha inválida";
                  break;
                case ApiErrorType.IsLockedOut:
                  this.errorMessage = "Usuário bloqueado";
                  break;
                case ApiErrorType.IsNotAllowed:
                  this.errorMessage = "Confirme seu e-mail para continuar";
                  break;
                default:
                  this.errorMessage = "Ocorreu um erro inesperado, tente novamente mais tarde";
              }
            }
          );
      });
  }

  backLogin() {
    this.showError = false;
  }
}
