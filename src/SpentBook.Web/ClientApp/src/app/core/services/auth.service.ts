// Angular/Core
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Module
import { ApiService } from './api.service';
import { Token } from '../models/token.model';
import { LoginRequest } from '../models/login-request.model';
import { UserRegister } from '../models/user.register.model';

@Injectable()
export class AuthService {
  constructor(
    private apiService: ApiService
  ) {}

  public login(login: string, password: string) : Observable<Token> {
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

  public register(user: UserRegister) : Observable<Token> {
    return this.apiService.addUser(user).pipe(
      tap(
        token =>  {},
        () => {}
      )
    );
  }

  public isLogged() : boolean {
    return window.localStorage['token'] != null;
  }


  private saveToken(token: Token) {
    window.localStorage['token'] = JSON.stringify(token);
  }
}
