// Angular/Core
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Module
import { ApiService } from './api.service';
import { LoginResult } from '../models/login-result.model';
import { LoginRequest } from '../models/login-request.model';
import { UserRegister } from '../models/user.register.model';

@Injectable()
export class AuthService {
  constructor(
    private apiService: ApiService
  ) {}

  public login(login: string, password: string) : Observable<LoginResult> {
    var request = new LoginRequest();
    request.userName = login;
    request.password = password;
    
    return this.apiService.login(request).pipe(
      tap(
        token => this.saveToken(token),
        () => {}
      )
    );
  }

  public register(user: UserRegister) : Observable<LoginResult> {
    return this.apiService.register(user).pipe(
      tap(
        token =>  {
        },
        () => {}
      )
    );
  }

  public isLogged() : boolean {
    return window.localStorage['token'] != null;
  }

  public saveToken(token: LoginResult) {
    window.localStorage['token'] = JSON.stringify(token);
  }

  public logout() {
    window.localStorage.removeItem('token');
  }
}
