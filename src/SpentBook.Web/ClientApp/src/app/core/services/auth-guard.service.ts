// Angular
import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

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
      // Faz um logout parcial para manter o usuário pré-logado
      this.authService.logout(false);

      if (state.url == null || state.url == '/')
        this.router.navigate(['login']);
      else
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});

      return false;
    }
    else if (!this.authService.isAuthorize(route.data['roles'])) {
      return false;
    }
    
    return true;
  }
}