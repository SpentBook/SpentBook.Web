import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { AuthService } from '../account/services/auth.service';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { BoxErrorComponent } from './components/box-error/box-error.component';

@NgModule({
  providers: [ApiService, AuthService],
  declarations: [TruncatePipe, BoxErrorComponent],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    TruncatePipe,
    BoxErrorComponent
  ]
})
export class CoreModule { }
