// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Module
import { ApiSpentBookService } from './webservices/spentbook/api-spentbook.service';
import { AuthService } from './services/auth.service';

@NgModule({
  providers: [ApiSpentBookService, AuthService],
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
