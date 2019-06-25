// Angular/Core
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

// App
import { environment } from '@src/environments/environment';

// Module
import { LoginRequest } from '../models/login-request.model';
import { LoginResult } from '../models/login-result.model';
import { UserRegister } from '../models/user.register.model';
import { UserCode } from '../models/user-code.model';
import { ChangePassword } from '../models/change-password.model';
import { User } from '../models/user.model';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) { }

  register(request: UserRegister): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${environment.apiUrl}/Auth/Register`, request);
  }

  login(request: LoginRequest): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${environment.apiUrl}/Auth/Login`, request);
  }

  confirmEmail(request: UserCode): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${environment.apiUrl}/Auth/ConfirmEmail`, request);
  }

  confirmEmailResend(request: UserCode): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ConfirmEmailResend`, request);
  }

  resetPassword(request: UserCode): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ResetPassword`, request );
  }

  changePassword(request: ChangePassword): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ChangePassword`, request);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User`, {});
  }

  updateUser(request: User): Observable<Object> {
    return this.http.put(`${environment.apiUrl}/User`, { request });
  }

  deleteUser(id: string): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/User`, { id });
  }
}
