// Angular
import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

// Module
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLogged()) {
      if (state.url == null || state.url == '/')
        this.router.navigate(['login']);
      else
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});

      return false;
    }
    return true;
  }
}