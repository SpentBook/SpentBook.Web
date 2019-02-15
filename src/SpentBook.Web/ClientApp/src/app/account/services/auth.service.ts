import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { LoginRequest } from 'src/app/core/models/login-request.model';


@Injectable()
export class AuthService {
  constructor(
    private apiService: ApiService
  ) {}

  login(login: string, password: string) {
    var request = new LoginRequest();
    request.userName = login;
    request.password = password;
    
    this.apiService.login(request).subscribe(
      data => alert(data),
      error => alert(error)
    );
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
