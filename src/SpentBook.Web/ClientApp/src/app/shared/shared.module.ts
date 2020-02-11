// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { RouterModule } from '@angular/router';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { InputRadioComponent } from './components/input-radio/input-radio.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { FooterComponent } from './components/footer/footer.component';


@NgModule({
  providers: [
    AuthService
  ],
  entryComponents: [SnackbarComponent],
  declarations: [
    // Pages
    PageNotFoundComponent,
    
    // Pipes
    TruncatePipe,

    // Components
    BoxErrorComponent,
    LoadingComponent,
    InputEmailComponent,
    InputNameComponent,
    InputPasswordComponent,
    InputDateComponent,
    InputButtonComponent,
    ToolbarComponent,
    SidenavComponent,
    SnackbarComponent,
    InputRadioComponent,
    FooterComponent
  ],
  imports: [
    // App modules

    // Others
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

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
    MatDividerModule,
    MatListModule,

    // Others
    FlexLayoutModule,

    //Alerts
    MatSnackBarModule,
  ],
  exports: [
    FormsModule,
    RouterModule,

    // Pipes
    TruncatePipe,

    // Components
    BoxErrorComponent,
    LoadingComponent,
    InputEmailComponent,
    InputDateComponent,
    InputNameComponent,
    InputRadioComponent,
    InputPasswordComponent,
    InputButtonComponent,
    ToolbarComponent,
    SidenavComponent,

    // Material Navigation
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,

    // Others
    FlexLayoutModule,
    MatSidenav,

    //Alerts
    MatSnackBarModule
  ]
})
export class SharedModule { }
