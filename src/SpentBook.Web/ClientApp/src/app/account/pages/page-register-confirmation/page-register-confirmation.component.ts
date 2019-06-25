import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer, Observable } from 'rxjs';

// App
import { ApiService, LoginResult, UserCode } from '@app/core';
import { ServerSideValidationService, BoxErrorComponent, ToolbarService, ToolbarMode } from '@app/shared';
import { SnackBarService } from '@src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-page-register-confirmation',
  templateUrl: './page-register-confirmation.component.html',
  styleUrls: ['./page-register-confirmation.component.styl']
})
export class PageRegisterConfirmationComponent implements OnInit {
  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  loading: boolean;
  observable$: Observable<LoginResult>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private serverSideValidate: ServerSideValidationService,
    private toolbarService: ToolbarService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.toolbarService.toolbarMode = ToolbarMode.BACK_BAR;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
    this.toolbarService.title = "Validando usuário...";

    const userId: string = this.route.snapshot.queryParamMap.get('userId');
    const code: string = this.route.snapshot.queryParamMap.get('code');
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.loading = true;

    timer(2000).subscribe(() => {
      var userCode = new UserCode();
      userCode.userId = userId;
      userCode.code = code;

      this.observable$ = this.apiService.confirmEmail(userCode);
      this.observable$.subscribe(
        () => {
          this.loading = false;
          this.router.navigateByUrl(returnUrl).then(() => {
            this.snackBarService.success("E-mail confirmado com sucesso");
          });;
        },
        error => {
          this.loading = false;
          this.serverSideValidate.validateWithBoxError(this, error, this.boxError);
        }
      );
    });
  }
}