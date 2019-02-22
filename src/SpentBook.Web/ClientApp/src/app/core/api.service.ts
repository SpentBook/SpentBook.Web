import { Injectable } from '@angular/core';
import { Token } from './models/token.model';
import { LoginRequest } from './models/login-request.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ApiResult } from './models/api-result.model';
import { User } from './models/user.model';
import { ConfirmEmailResend } from './models/confirm-email-resend.model';
import { ConfirmEmail } from './models/confirm-email.model';
import { ResetPassword } from './models/reset-password.model';
import { ChangePassword } from './models/change-password.model';
import { delay } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) {}

  login(request: LoginRequest): Observable<Token> {
    return this.http.post<Token>(`${environment.apiUrl}/Auth/login`, request).pipe(delay(10000));
  }

  confirmEmail(request: ConfirmEmail): Observable<Token> {
    return this.http.post<Token>(`${environment.apiUrl}/Auth/ConfirmEmail`, { request });
  }

  confirmEmailResend(request: ConfirmEmailResend): Observable<ApiResult> {
    return this.http.post<ApiResult>(`${environment.apiUrl}/Auth/ConfirmEmailResend`, { request });
  }

  resetPassword(request: ResetPassword): Observable<ApiResult> {
    return this.http.post<ApiResult>(`${environment.apiUrl}/Auth/ResetPassword`, { request });
  }

  changePassword(request: ChangePassword): Observable<ApiResult> {
    return this.http.post<ApiResult>(`${environment.apiUrl}/Auth/ChangePassword`, { request });
  }

  addUser(request: User): Observable<ApiResult> {
    return this.http.post<ApiResult>(`${environment.apiUrl}/User`, { request });
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User`, { });
  }

  updateUser(request: User): Observable<ApiResult> {
    return this.http.put<ApiResult>(`${environment.apiUrl}/User`, { request });
  }

  deleteUser(id: string): Observable<ApiResult> {
    return this.http.post<ApiResult>(`${environment.apiUrl}/User`, { id });
  }
}
