// Angular
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { timer, Observable } from 'rxjs';

// App
import { BoxErrorComponent, ServerSideValidationService, ToolbarService, ToolbarMode } from '@app/shared';
import { ApiService, UserCode } from '@app/core';

@Component({
  selector: 'app-register-finish',
  templateUrl: './register-finish.component.html',
  styleUrls: ['./register-finish.component.styl']
})
export class RegisterFinishComponent implements OnInit {
  @ViewChild(BoxErrorComponent)
  boxError: BoxErrorComponent;

  @Input()
  urlCallbackConfirmation: string;

  @Input()
  email: string;

  @Output()
  login: EventEmitter<any> = new EventEmitter<any>();

  loading: boolean;
  observable$: Observable<Object>;

  constructor(
    private apiService: ApiService,
    private serverSideValidate: ServerSideValidationService,
    private toolbarService: ToolbarService
  ) { }

  ngOnInit() {
    this.toolbarService.toolbarMode = ToolbarMode.BACK_BAR;
    this.toolbarService.showLogo = true;
    this.toolbarService.showBackButton = false;
    this.toolbarService.title = "Quase lá! Confirme seu e-mail!";
  }
  
  resendEmail() {
    this.loading = true;

    timer(2000).subscribe(() => {
      var userCode = new UserCode();
      userCode.email = this.email;
      userCode.urlCallbackConfirmation = this.urlCallbackConfirmation;
      this.observable$ = this.apiService.confirmEmailResend(userCode)
      this.observable$.subscribe(
        () => {
          this.loading = false;
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
