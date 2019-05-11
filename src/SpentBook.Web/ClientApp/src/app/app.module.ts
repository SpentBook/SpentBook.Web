import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AccountModule } from './account/account.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CoreModule } from './core/core.module';
import { CultureInfoModule } from './culture-info/culture-info.module';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account/account-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatCardModule, MatToolbarModule, MatInputModule, MatSelectModule, MatTableModule, MatIconModule, MatGridListModule, MatMenuModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    // FieldMatchValidatorDirective
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    AccountModule,
    DashboardModule,
    BrowserAnimationsModule,
    CultureInfoModule,

    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,

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
    HeaderComponent
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
