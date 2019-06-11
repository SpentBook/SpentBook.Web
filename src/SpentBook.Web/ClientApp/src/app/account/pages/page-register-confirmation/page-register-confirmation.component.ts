import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer, Observable } from 'rxjs';

// App
import { ApiService, Token } from '@app/core';
import { ServerSideValidationService, BoxErrorComponent, ToolbarService, ToolbarMode } from '@app/shared';

@Component({
  selector: 'app-page-register-confirmation',
  templateUrl: './page-register-confirmation.component.html',
  styleUrls: ['./page-register-confirmation.component.styl']
})
export class PageRegisterConfirmationComponent implements OnInit {
  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  loading: boolean;
  observable$: Observable<Token>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private serverSideValidate: ServerSideValidationService,
    private toolbarService: ToolbarService
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
      this.observable$ = this.apiService.confirmEmail(userId, code)
      this.observable$.subscribe(
        () => {
          this.loading = false;
          //this.router.navigateByUrl(returnUrl);
        },
        error => {
          this.loading = false;
          this.serverSideValidate.validateWithBoxError(this, error, this.boxError);
        }
      );
    });
  }
}