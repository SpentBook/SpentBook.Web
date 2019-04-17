import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { LoginComponent } from './components/login/login.component';
import { PageLogoutComponent } from './pages/page-logout/page-logout.component';
import { PageRegisterComponent } from './pages/page-register/page-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { CoreModule } from '../core/core.module';
import { RegisterComponent } from './components/register/register.component';

import {
  MatToolbarModule, MatButtonModule, MatInputModule, MatIconModule, MatSelectModule, MatTableModule, MatGridListModule,
  MatCardModule, MatMenuModule, MatFormFieldModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoxErrorComponent } from '../core/components/box-error/box-error.component';

@NgModule({
  declarations: [
    PageLoginComponent,
    LoginComponent,
    PageLogoutComponent,
    PageRegisterComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    AppRoutingModule,

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
    // Material
    // MatButtonModule,
    // MatCardModule,
    // MatMenuModule,
    // MatIconModule,
    // MatSelectModule,
    // MatInputModule,
    // MatToolbarModule,
    // MatTableModule,
    // MatSelectModule,
    // BrowserAnimationsModule,
    // MatFormFieldModule,
    // MatOptionModule
    // Material
  ],
  providers: []
})
export class AccountModule { }
