// Angular/Core
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

// App
import { environment } from '@src/environments/environment';

// Module
import { LoginRequest } from './request/login-request.model';
import { RegistrationRequest } from './request/registration-request.model';
import { CodeConfirmationRequest } from './request/code-confirmation-request.model';
import { ChangePasswordRequest } from './request/change-password-request.model';
import { User } from '../../models/user.model';

import { LoginResponse } from './response/login-response.model';
import { ConfirmEmailResendRequest } from './request/confirm-email-resend-request.model';
import { ResetEmailRequest } from './request/reset-email-request.model';
import { LoginFacebookRequest } from './request/login-facebook-request.model';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class ApiSpentBookAuthService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  register(request: RegistrationRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/Register`, request);
  }

  confirmEmailResend(request: ConfirmEmailResendRequest): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ConfirmEmailResend`, request);
  }

  confirmEmail(request: CodeConfirmationRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/ConfirmEmail`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/Login`, request);
  }

  loginFacebook(request: LoginFacebookRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/LoginFacebook`, request);
  }

  resetPassword(request: ResetEmailRequest): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ResetPassword`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/Auth/ChangePassword`, request);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User`, { headers: this.getHeaders() });
  }

  updateUser(request: User): Observable<Object> {
    return this.http.put(`${environment.apiUrl}/User`, request, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<Object> {
    return this.http.delete(`${environment.apiUrl}/User`, { headers: this.getHeaders() });
  }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getLoggedUser().token}`
    });
  }

}
