import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { LoginRequest } from 'src/app/core/models/login-request.model';
import { Observable } from 'rxjs';
import { Token } from 'src/app/core/models/token.model';


@Injectable()
export class AuthService {
  constructor(
    private apiService: ApiService
  ) {}

  login(login: string, password: string) : Observable<Token> {
    var request = new LoginRequest();
    request.userName = login;
    request.password = password;
    
    var observable = this.apiService.login(request);
    observable.subscribe(
      data => alert(1),
      error => alert(2222)
    );
    observable.subscribe(
      data => alert(11),
      error => alert(12)
    );
    return observable;
  }

  private getToken(): String {
    return window.localStorage['token'];
  }

  private saveToken(token: String) {
    window.localStorage['token'] = token;
  }

  private destroyToken() {
    window.localStorage.removeItem('token');
  }
}
