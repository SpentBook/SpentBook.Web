import { Injectable } from '@angular/core';
import { Token } from './models/token.model';
import { LoginRequest } from './models/login-request.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { User } from './models/user.model';
import { ConfirmEmailResend } from './models/confirm-email-resend.model';
import { ConfirmEmail } from './models/confirm-email.model';
import { ResetPassword } from './models/reset-password.model';
import { ChangePassword } from './models/change-password.model';
import { delay } from 'rxjs/operators';
import { UserRegister } from './models/user.register.model';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) {}

  login(request: LoginRequest): Observable<Token> {
    return this.http.post<Token>(`${environment.apiUrl}/Auth/login`, request);
  }

  addUser(request: UserRegister): Observable<Token> {
    return this.http.post<Token>(`${environment.apiUrl}/User`, request );
  }

  confirmEmail(request: ConfirmEmail): Observable<Token> {
    return this.http.post<Token>(`${environment.apiUrl}/Auth/ConfirmEmail`, { request });
  }

  confirmEmailResend(request: ConfirmEmailResend): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ConfirmEmailResend`, { request });
  }

  resetPassword(request: ResetPassword): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ResetPassword`, { request });
  }

  changePassword(request: ChangePassword): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ChangePassword`, { request });
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User`, { });
  }

  updateUser(request: User): Observable<Object> {
    return this.http.put(`${environment.apiUrl}/User`, { request });
  }

  deleteUser(id: string): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/User`, { id });
  }
}
