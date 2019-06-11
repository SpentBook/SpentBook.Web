// Angular/Core
import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { timer, Observable } from 'rxjs';

// App
import { AuthService, ProblemDetails, Token } from '@app/core';
import { BoxErrorComponent, ServerSideValidationService } from '@app/shared';

/*
TODO:
1 - Loading 
2 - Validação client side
3 - Transição
4 - Como ou quando matar o observable ?
5 - Facebook login
6 - multi-language
7 - Criar botão de cancelar login no loading
8 - Se estiver logado, deve ir para a home
9 - Fazer o ESC voltar para o login em caso de erro
*/

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit, AfterViewChecked {

  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  form: FormGroup;
  isSubmitting = false;
  returnUrl: string;
  showError: boolean;
  errorMessage: string;
  loading: boolean;
  login$: Observable<Token>;

  get userName(): any { return this.form.get('userName'); }
  get password(): any { return this.form.get('password'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      userName: new FormControl(),
      password: new FormControl(),
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    // Resolve o bug: ExpressionChangedAfterItHasBeenCheckedError: 
    // Expression has changed after it was checked.
    this.cdRef.detectChanges();
  }

  submitForm() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    timer(2000).subscribe(() => {
      this.login$ = this.authService.login(this.userName.value, this.password.value)
      this.login$.subscribe(
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
  }

  backLogin() {
    this.boxError.show = false;
  }
}
