// Angular/Core
import { Injectable } from '@angular/core';
import { AuthService as AuthServiceSocial } from "angularx-social-login";

// Module
import { LoginResponse } from '../webservices/spentbook/response/login-response.model';

export enum LOGIN_TYPE {
  APP,
  FACEBOOK
}

@Injectable()
export class AuthService {
  private static USER_KEY: string = 'user';

  public loginType: LOGIN_TYPE;

  constructor(
    private authServiceSocial: AuthServiceSocial
  ) { }

  public isLogged(): boolean {
    return window.localStorage[AuthService.USER_KEY] != null;
  }

  public login(loginResponse: LoginResponse) {
    window.localStorage[AuthService.USER_KEY] = JSON.stringify(loginResponse);
  }

  public logout() {
    window.localStorage.removeItem(AuthService.USER_KEY);

    // remove qualquer login em midias sociais    
    return this.authServiceSocial.signOut(true);
  }

  public getLoggedUser(): LoginResponse {
    return JSON.parse(window.localStorage[AuthService.USER_KEY]);
  }

  public getTokenAsString() {
    return JSON.stringify(this.getLoggedUser().token);
  }
}
