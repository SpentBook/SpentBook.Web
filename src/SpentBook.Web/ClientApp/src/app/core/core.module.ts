import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { AuthService } from '../account/services/auth.service';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { BoxErrorComponent } from './components/box-error/box-error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { InputEmailComponent } from './components/input-email/input-email.component';
import { InputNameComponent } from './components/input-name/input-name.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputButtonComponent } from './components/input-button/input-button.component';
import { MatButtonModule, MatFormFieldModule, MatCardModule, MatToolbarModule, MatInputModule, MatSelectModule, MatTableModule, MatIconModule, MatGridListModule, MatMenuModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  providers: [ApiService, AuthService],
  declarations: [TruncatePipe, BoxErrorComponent, LoadingComponent, InputEmailComponent, InputNameComponent, InputPasswordComponent, InputDateComponent, InputButtonComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    
    // Material
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    LayoutModule,
    MatOptionModule,
    MatRadioModule,
    
    // DatePicker
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    TruncatePipe,
    BoxErrorComponent,
    LoadingComponent,
    InputEmailComponent,
    InputDateComponent,
    InputNameComponent,
    InputPasswordComponent,
    InputButtonComponent
  ]
})
export class CoreModule { }
