// Angular
import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective } from '@angular/forms';

// App
import { BoxErrorComponent, ServerSideValidationService, ToolbarService, SnackBarService, CustomValidations, ToolbarMode } from '@app/shared';
import { Observable, timer } from 'rxjs';
import { ApiSpentBookUserService, UnregisterRequest, AuthService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-unregister',
  templateUrl: './page-unregister.component.html',
  styleUrls: ['./page-unregister.component.styl']
})
export class PageUnregisterComponent implements OnInit, AfterViewChecked {

  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  form: FormGroup;
  isSubmitted = false;
  returnUrl: string;
  loading: boolean;
  observable$: Observable<Object>;

  get password(): any { return this.form.get('password'); }

  constructor(
    private apiService: ApiSpentBookUserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private serverSideValidate: ServerSideValidationService,
    private cdRef: ChangeDetectorRef,
    private toolbarService: ToolbarService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {
    this.returnUrl = '/';

    this.form = this.fb.group({
      password: new FormControl(),
    });
  }

  ngOnInit() {
    this.toolbarService.setToolbar(ToolbarMode.FULL, true, false, null);
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

    var request = new UnregisterRequest();
    request.password = this.password.value;

    timer(500).subscribe(() => {
      this.observable$ = this.apiService.unregister(request);
      this.observable$.subscribe(
        () => {
          this.authService.logout().then(
            () => {
              this.goLogin()
            },
            () => {
              this.goLogin()
            },
          );
        },
        error => {
          this.loading = false;
          this.serverSideValidate.validateWithBoxError(this, error, this.boxError);
        }
      );
    });
  }

  goLogin() {
    this.router.navigateByUrl(this.returnUrl).then(() => {
      this.snackBarService.success("Usuário excluído com sucesso!");
    });;
  }

  hideBoxError() {
    this.boxError.show = false;
  }

}
