// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Module
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';

@NgModule({
  providers: [ApiService, AuthService],
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
