// Angular/Core
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

// App
import { environment } from '@src/environments/environment';

// Module
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

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

  delete(id: string): Observable<Object> {
    return this.http.delete(`${environment.apiUrl}/User`, { headers: this.getHeaders() });
  }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getLoggedUser().token}`
    });
  }

}
