// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material
import { MatButtonModule, MatFormFieldModule, MatCardModule, MatInputModule, MatSelectModule, MatTableModule, MatIconModule, MatGridListModule, MatMenuModule, MatOptionModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule, MatToolbarModule, MatSidenavModule, MatDividerModule, MatNavList, MatListModule, MatSidenav, MatListItem } from '@angular/material';

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
import { ToolbarService } from './services/toolbar.service';

@NgModule({
  providers: [AuthService, ToolbarService],
  declarations: [
    TruncatePipe,
    BoxErrorComponent,
    LoadingComponent,
    InputEmailComponent,
    InputNameComponent,
    InputPasswordComponent,
    InputDateComponent,
    InputButtonComponent,
    ToolbarComponent,
    SidenavComponent
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
    FlexLayoutModule
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
    MatSidenav
  ]
})
export class SharedModule { }
