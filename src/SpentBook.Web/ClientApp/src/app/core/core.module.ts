// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Module
import { ApiSpentBookAuthService } from './webservices/spentbook/api-spentbook-auth.service';
import { ApiSpentBookUserService } from './webservices/spentbook/api-spentbook-user.service';
import { AuthService } from './services/auth.service';

@NgModule({
  providers: [ApiSpentBookAuthService, ApiSpentBookUserService, AuthService],
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
