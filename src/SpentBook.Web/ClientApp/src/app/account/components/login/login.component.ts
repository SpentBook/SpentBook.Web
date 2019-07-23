// Angular/Core
import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { timer, Observable, Subscription } from 'rxjs';
import { AuthService as AuthServiceSocial, SocialUser } from 'angularx-social-login';

// App
import { AuthService, LoginRequest, ApiSpentBookAuthService, LoginResponse, LoginFacebookRequest, LOGIN_TYPE } from '@app/core';
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
export class LoginComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  form: FormGroup;
  isSubmitted = false;
  returnUrl: string;
  showError: boolean;
  errorMessage: string;
  loading: boolean;
  observable$: Observable<LoginResponse>;
  socialObservable$: Subscription;

  get userName(): any { return this.form.get('userName'); }
  get password(): any { return this.form.get('password'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiSpentBookService: ApiSpentBookAuthService,
    private authService: AuthService,
    private fb: FormBuilder,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef,
    private authServiceSocial: AuthServiceSocial
  ) {
    this.form = this.fb.group({
      userName: new FormControl(),
      password: new FormControl(),
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {
    this.socialObservable$ = this.authServiceSocial.authState.subscribe((user) => {
      if (user != null && this.authService.loginType == LOGIN_TYPE.FACEBOOK) {
        this.loginFacebook(user);
      }
    });
  }

  ngOnDestroy(): void {
    this.socialObservable$.unsubscribe();
  }

  ngAfterViewChecked(): void {
    // Resolve o bug: ExpressionChangedAfterItHasBeenCheckedError: 
    // Expression has changed after it was checked.
    this.cdRef.detectChanges();
  }

  login() {
    if (!this.form.valid && !this.isSubmitted) {
      return;
    }

    this.isSubmitted = true;
    this.loading = true;

    timer(2000).subscribe(() => {
      var request = new LoginRequest();
      request.userName = this.userName.value;
      request.password = this.password.value;
      this.observable$ = this.apiSpentBookService.login(request);
      this.observable$.subscribe(
        (response) => {
          this.loading = false;
          this.authService.login(response);
          this.router.navigateByUrl(this.returnUrl);
        },
        error => {
          this.loading = false;
          this.serverSideValidate.validateWithBoxError(this, error, this.boxError);
        }
      );
    });
  }

  loginFacebook(user: SocialUser) {
    this.loading = true;

    timer(2000).subscribe(() => {
      var request = new LoginFacebookRequest();
      request.AccessToken = user.authToken;
      this.observable$ = this.apiSpentBookService.loginFacebook(request);
      this.observable$.subscribe(
        (response) => {
          this.loading = false;
          this.authService.login(response);
          this.router.navigateByUrl(this.returnUrl);
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
}
