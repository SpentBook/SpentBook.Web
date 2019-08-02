// Angular
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewChecked, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, timer } from 'rxjs';

// App
import { SnackBarService, ToolbarService, ToolbarMode, BoxErrorComponent, ServerSideValidationService } from '@app/shared';
import { ApiSpentBookAuthService, ResetEmailRequest } from '@app/core';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-page-forgot-password',
  templateUrl: './page-forgot-password.component.html',
  styleUrls: ['./page-forgot-password.component.styl']
})
export class PageForgotPasswordComponent implements OnInit, AfterViewChecked {

  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  form: FormGroup;
  isSubmitted = false;
  returnUrl: string;
  showError: boolean;
  errorMessage: string;
  loading: boolean;
  observable$: Observable<Object>;
  urlCallbackConfirmation: string;

  get email(): any { return this.form.get('email'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiSpentBookAuthService,
    private fb: FormBuilder,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef,
    private toolbarService: ToolbarService,
    private snackBarService: SnackBarService,
    private platformLocation: PlatformLocation,
  ) {
    this.form = this.fb.group({
      email: new FormControl(),
    });
    var baseUrl = (platformLocation as any).location.origin;
    this.urlCallbackConfirmation = `${baseUrl}/change-password?userId={user-id}&code={code}`;
  }

  ngOnInit() {
    this.toolbarService.setToolbar(ToolbarMode.BACK_BAR, true, false, "Esqueceu sua senha?");
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

    var request = new ResetEmailRequest();
    request.email = this.email.value;
    request.urlCallbackConfirmation = this.urlCallbackConfirmation;
    
    timer(2000).subscribe(() => {
      this.observable$ = this.apiService.resetPassword(request);
      this.observable$.subscribe(
        () => {
          this.loading = false;
          this.snackBarService.success("E-mail enviado com sucesso, você receberá um email com um link para redefinir sua senha.");
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