// Angular/Core
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

// App
import { environment } from '@src/environments/environment';

// Module
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordProfileRequest } from './request/change-password-profile-request.model';
import { UnregisterRequest } from './request/unregister-request.model';

@Injectable()
export class ApiSpentBookUserService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User`, { headers: this.getHeaders() });
  }

  update(request: User): Observable<Object> {
    return this.http.put(`${environment.apiUrl}/User`, request, { headers: this.getHeaders() });
  }

  unregister(request: UnregisterRequest): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/User/Unregister`, request, { headers: this.getHeaders() });
  }

  changePassword(request: ChangePasswordProfileRequest): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/User/ChangePassword`, request, { headers: this.getHeaders() });
  }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getLoggedUser().token}`
    });
  }

}
