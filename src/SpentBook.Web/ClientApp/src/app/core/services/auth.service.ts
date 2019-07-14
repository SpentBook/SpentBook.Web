// Angular/Core
import { Injectable } from '@angular/core';
import { AuthService as AuthServiceSocial } from "angularx-social-login";

// Module
import { ApiSpentBookService } from '../webservices/spentbook/api-spentbook.service';
import { LoginResponse } from '../webservices/spentbook/response/login-response.model';

export enum LOGIN_TYPE {
  APP,
  FACEBOOK
}

@Injectable()
export class AuthService {
  public loginType: LOGIN_TYPE;

  constructor(
    private apiService: ApiSpentBookService,
    private authServiceSocial: AuthServiceSocial
  ) { }

  public isLogged(): boolean {
    return window.localStorage['token'] != null;
  }

  public login(token: LoginResponse) {
    window.localStorage['token'] = JSON.stringify(token);
  }

  public logout() {
    window.localStorage.removeItem('token');

    // remove qualquer login em midias sociais    
    return this.authServiceSocial.signOut(true);
  }
}
