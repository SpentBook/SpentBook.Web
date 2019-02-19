import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { LoginRequest } from 'src/app/core/models/login-request.model';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { Token } from 'src/app/core/models/token.model';
import { getToken } from '@angular/router/src/utils/preactivation';


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
        error => {}
      )
    );
  }

  public isLogged() : boolean {
    return window.localStorage['token'] != null;
  }

  private getToken(): Token {
    var token = window.localStorage['token'];
    if (token != null)
      return <Token>JSON.parse(token);
    return null;
  }

  private saveToken(token: Token) {
    window.localStorage['token'] = JSON.stringify(token);
  }

  private destroyToken() {
    window.localStorage.removeItem('token');
  }
}
