// Angular/Core
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Module
import { ApiSpentBookService } from '../webservices/spentbook/api-spentbook.service';
import { LoginResponse } from '../webservices/spentbook/response/login-response.model';
import { LoginRequest } from '../webservices/spentbook/request/login-request.model';
import { RegistrationRequest } from '../webservices/spentbook/request/registration-request.model';

@Injectable()
export class AuthService {
  constructor(
    private apiService: ApiSpentBookService
  ) {}

  public isLogged() : boolean {
    return window.localStorage['token'] != null;
  }

  public login(token: LoginResponse) {
    window.localStorage['token'] = JSON.stringify(token);
  }

  public logout() {
    window.localStorage.removeItem('token');
  }
}
