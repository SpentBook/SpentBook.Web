// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Module
import { ApiSpentBookAuthService } from './webservices/spentbook/api-spentbook-auth.service';
import { ApiSpentBookUserService } from './webservices/spentbook/api-spentbook-user.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';

@NgModule({
  providers: [
    ApiSpentBookAuthService,
    ApiSpentBookUserService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
  declarations: [

  ],
  imports: [
    // Core
    CommonModule,
    HttpClientModule
  ],
  exports: [

  ]
})
export class CoreModule { }
