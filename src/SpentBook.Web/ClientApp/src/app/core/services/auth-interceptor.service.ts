import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token: string = 'invald token';
    // req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });

    return next.handle(req).pipe(
      // map((event: HttpEvent<any>) => {
      //   if (event instanceof HttpResponse) {
      //     console.log('event', event);
      //   }
      //   return event;
      // }),
      catchError((err: HttpErrorResponse) => {
        // Caso a API devolva 401 é pq o token expirou
        // Caso exista local storage é pq ele está logado no front ainda
        // Caso não exista o local storage é pq ele está na tela de login onde não existe
        // essa info e ele errou o login enviando 401
        if (err.status === 401 && this.authService.hasLocalStorage()) {
          this.authService.autoLogout();
        }

        return throwError(err);
      }));
  }
}