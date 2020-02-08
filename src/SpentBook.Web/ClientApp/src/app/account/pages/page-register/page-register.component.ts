// Angular
import { Component, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// App
import { ToolbarService, ToolbarMode } from '@app/shared';
import { LoginResponse, RegistrationRequest, AuthService } from '@app/core';

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.component.html',
  styleUrls: ['./page-register.component.styl']
})
export class PageRegisterComponent implements OnInit {
  showRegister: boolean = true;
  showFinish: boolean = false;
  
  private urlCallbackConfirmation: string;
  private email: string;
  private returnUrl: string;

  constructor(
    private toolbarService: ToolbarService,
    private platformLocation: PlatformLocation,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    
  ) {
    var baseUrl = (platformLocation as any).location.origin;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.urlCallbackConfirmation = `${baseUrl}/register-confirmation?userId={user-id}&code={code}&returnUrl=${this.returnUrl}`;
  }

  ngOnInit() {
    this.toolbarService.setToolbar(ToolbarMode.BACK_BAR, true, false, "Cadastrar novo usuário");
  }

  registerFinish($event: { userRegister: RegistrationRequest, loginResult: LoginResponse }) {
    this.email = $event.userRegister.email;

    if ($event.loginResult.requireConfirmedEmail) {
      this.showRegister = false;
      this.showFinish = true;
    }
    else if ($event.loginResult.requireConfirmedPhoneNumber) {

    }
    else {
      this.authService.login($event.loginResult);
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  login() {
    this.router.navigate(['login']);
  }
}
