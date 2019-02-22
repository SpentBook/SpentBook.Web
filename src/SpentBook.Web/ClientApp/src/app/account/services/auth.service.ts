import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { LoginRequest } from 'src/app/core/models/login-request.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Token } from 'src/app/core/models/token.model';


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

  public isLogged() : boolean {
    return window.localStorage['token'] != null;
  }


  private saveToken(token: Token) {
    window.localStorage['token'] = JSON.stringify(token);
  }

}
