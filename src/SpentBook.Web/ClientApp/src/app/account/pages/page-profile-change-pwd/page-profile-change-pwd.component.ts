// Angular
import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective } from '@angular/forms';

// App
import { BoxErrorComponent, ServerSideValidationService, ToolbarService, SnackBarService, CustomValidations, ToolbarMode } from '@app/shared';
import { Observable, timer } from 'rxjs';
import { ApiSpentBookUserService, ChangePasswordProfileRequest } from '@app/core';

@Component({
  selector: 'app-page-profile-change-pwd',
  templateUrl: './page-profile-change-pwd.component.html',
  styleUrls: ['./page-profile-change-pwd.component.styl']
})
export class PageProfileChangePwdComponent implements OnInit, AfterViewChecked {

  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  form: FormGroup;
  isSubmitted = false;
  returnUrl: string;
  showError: boolean;
  errorMessage: string;
  loading: boolean;
  observable$: Observable<Object>;
  userId: string;
  code: string;

  get passwordCurrent(): any { return this.form.get('passwordCurrent'); }
  get password(): any { return this.form.get('passwordGroup').get('password'); }
  get passwordConfirm(): any { return this.form.get('passwordGroup').get('passwordConfirm'); }

  constructor(
    private apiService: ApiSpentBookUserService,
    private fb: FormBuilder,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef,
    private toolbarService: ToolbarService,
    private snackBarService: SnackBarService,
  ) {
    this.form = this.fb.group({
      passwordCurrent: new FormControl(),
      passwordGroup: this.fb.group({
        password: new FormControl(),
        passwordConfirm: new FormControl()
      }, {
          validator: CustomValidations.passwordMatchValidator('passwordConfirm', 'password')
        }),
    });
  }

  ngOnInit() {
    this.toolbarService.toolbarMode = ToolbarMode.FULL;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
    this.toolbarService.title = null;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  submitForm(formDirective: FormGroupDirective) {
    if (!this.form.valid && !this.isSubmitted) {
      return;
    }

    this.isSubmitted = true;
    this.loading = true;

    var request = new ChangePasswordProfileRequest();
    request.passwordCurrent = this.passwordCurrent.value;
    request.password = this.password.value;
    request.passwordConfirm = this.passwordConfirm.value;

    timer(500).subscribe(() => {
      this.observable$ = this.apiService.changePassword(request);
      this.observable$.subscribe(
        () => {
          this.loading = false;
          this.form.reset();
          formDirective.resetForm();
          this.snackBarService.success("Senha alterada com sucesso!");
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
