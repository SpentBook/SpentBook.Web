import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { AuthService } from '../account/services/auth.service';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';

@NgModule({
  providers: [ApiService, AuthService],
  declarations: [TruncatePipe],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    TruncatePipe
  ]
})
export class CoreModule { }
