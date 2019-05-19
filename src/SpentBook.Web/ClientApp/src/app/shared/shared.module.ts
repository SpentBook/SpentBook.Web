// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { MatButtonModule, MatFormFieldModule, MatCardModule, MatInputModule, MatSelectModule, MatTableModule, MatIconModule, MatGridListModule, MatMenuModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule, MatToolbarModule, MatSidenavModule } from '@angular/material';

// App 
import { AuthService } from '@app/core';

// Module
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { BoxErrorComponent } from './components/box-error/box-error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { InputEmailComponent } from './components/input-email/input-email.component';
import { InputNameComponent } from './components/input-name/input-name.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputButtonComponent } from './components/input-button/input-button.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  providers: [AuthService],
  declarations: [
    TruncatePipe,
    BoxErrorComponent,
    LoadingComponent,
    InputEmailComponent,
    InputNameComponent,
    InputPasswordComponent,
    InputDateComponent,
    InputButtonComponent,
    HeaderComponent
  ],
  imports: [
    // App modules

    // Others
    CommonModule,
    ReactiveFormsModule,
    // LayoutModule,
    // HttpClientModule,
    // FormsModule,
    // CoreModule,

    // Material
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatOptionModule,
    MatRadioModule,

    // DatePicker
    MatDatepickerModule,
    MatNativeDateModule,

    // Navigation
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    FlexLayoutModule
  ],
  exports: [
    // Pipes
    TruncatePipe,

    // Components
    BoxErrorComponent,
    LoadingComponent,
    InputEmailComponent,
    InputDateComponent,
    InputNameComponent,
    InputPasswordComponent,
    InputButtonComponent,
    HeaderComponent,

    // Material Navigation
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    FlexLayoutModule,
    MatButtonModule
  ]
})
export class SharedModule { }
