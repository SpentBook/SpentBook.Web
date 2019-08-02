// Angular/Core
import { Injectable } from '@angular/core';
import { AuthService as AuthServiceSocial } from "angularx-social-login";
import { JwtHelperService } from "@auth0/angular-jwt";

// Module
import { LoginResponse } from '../webservices/spentbook/response/login-response.model';
import { JwtToken } from '..';
import { Router } from '@angular/router';

export enum LOGIN_TYPE {
  APP,
  FACEBOOK
}

@Injectable()
export class AuthService {
  private static USER_KEY: string = 'user';

  public loginType: LOGIN_TYPE;

  constructor(
    private authServiceSocial: AuthServiceSocial,
    private router: Router,
  ) { }

  public hasLocalStorage(): boolean {
    return window.localStorage[AuthService.USER_KEY] != null;
  }

  public isLogged(): boolean {
    if (this.hasLocalStorage() && !this.isTokenExpired()) {
      return true;
    }

    return false;
  }

  public login(loginResponse: LoginResponse) {
    window.localStorage[AuthService.USER_KEY] = JSON.stringify(loginResponse);
  }

  public logout(removeAll: boolean = true) {
    if (removeAll) {
      window.localStorage.removeItem(AuthService.USER_KEY);
      // remove qualquer login em midias sociais    
      return this.authServiceSocial.signOut(false);
    }
    else {
      // Quando o login for parcial, não devemos remover os dados do usuário
      // devemos manter os dados no storege, porém o tempo do token já expirou, ou seja,
      // ele nunca consegue logar. Mas precisamos limpar essa info para ele não fazer um 
      // auto-login
      this.loginType = null;
    }
  }

  public autoLogout() {
    this.logout().then(
      () => {
        this.goLogin()
      },
      () => {
        this.goLogin()
      },
    );
  }

  public goLogin() {
    return this.router.navigate(['login']);
  }

  public getLoggedUser(): LoginResponse {
    if (!this.hasLocalStorage())
      return null;

    return JSON.parse(window.localStorage[AuthService.USER_KEY]);
  }

  public getToken(): JwtToken {
    if (!this.hasLocalStorage())
      return null;

    const helper = new JwtHelperService();
    return helper.decodeToken(this.getLoggedUser().token);
  }

  public isTokenExpired(): boolean {
    if (!this.hasLocalStorage())
      return true;

    const helper = new JwtHelperService();
    return helper.isTokenExpired(this.getLoggedUser().token);
  }

  public getEmail(): string {
    if (!this.hasLocalStorage())
      return null;

    return this.getToken().sub;
  }

}
