// Angular
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewChecked, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, timer } from 'rxjs';

// App
import { SnackBarService, ToolbarService, ToolbarMode, BoxErrorComponent, ServerSideValidationService, CustomValidations } from '@app/shared';
import { ApiSpentBookAuthService, ResetEmailRequest, ChangePasswordRequest } from '@app/core';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-page-change-password',
  templateUrl: './page-change-password.component.html',
  styleUrls: ['./page-change-password.component.styl']
})
export class PageChangePasswordComponent implements OnInit, AfterViewChecked {

  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  form: FormGroup;
  isSubmitted = false;
  returnUrl: string;
  loading: boolean;
  observable$: Observable<Object>;
  userId: string;
  code: string;

  get password(): any { return this.form.get('passwordGroup').get('password'); }
  get passwordConfirm(): any { return this.form.get('passwordGroup').get('passwordConfirm'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiSpentBookAuthService,
    private fb: FormBuilder,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef,
    private toolbarService: ToolbarService,
    private snackBarService: SnackBarService,
  ) {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.code = this.route.snapshot.queryParamMap.get('code');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.form = this.fb.group({
      passwordGroup: this.fb.group({
        password: new FormControl(),
        passwordConfirm: new FormControl()
      }, {
          validator: CustomValidations.passwordMatchValidator('passwordConfirm', 'password')
        }),
    });
  }

  ngOnInit() {
    this.toolbarService.toolbarMode = ToolbarMode.BACK_BAR;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
    this.toolbarService.title = "Criar uma nova senha";
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  submitForm() {
    if (!this.form.valid && !this.isSubmitted) {
      return;
    }

    this.isSubmitted = true;
    this.loading = true;

    var request = new ChangePasswordRequest();
    request.userId = this.userId;
    request.code = this.code;
    request.password = this.password.value;
    request.passwordConfirm = this.passwordConfirm.value;

    timer(2000).subscribe(() => {
      this.observable$ = this.apiService.changePassword(request);
      this.observable$.subscribe(
        () => {
          this.loading = false;

          this.router.navigateByUrl(this.returnUrl).then(() => {
            this.snackBarService.success("Senha alterada com sucesso!");
          });;
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