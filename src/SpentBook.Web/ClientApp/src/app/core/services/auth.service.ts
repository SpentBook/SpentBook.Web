// Angular/Core
import { Injectable } from '@angular/core';
import { AuthService as AuthServiceSocial } from "angularx-social-login";

// Module
import { ApiSpentBookService } from '../webservices/spentbook/api-spentbook.service';
import { LoginResponse } from '../webservices/spentbook/response/login-response.model';

@Injectable()
export class AuthService {
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
