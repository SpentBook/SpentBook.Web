// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// App
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

// Module
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { LoginComponent } from './components/login/login.component';
import { PageLogoutComponent } from './pages/page-logout/page-logout.component';
import { PageRegisterComponent } from './pages/page-register/page-register.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountRoutingModule } from './account-routing.module';
import { PageRegisterConfirmationComponent } from './pages/page-register-confirmation/page-register-confirmation.component';

@NgModule({
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  declarations: [
    PageLoginComponent,
    LoginComponent,
    PageLogoutComponent,
    PageRegisterComponent,
    RegisterComponent,
    PageRegisterConfirmationComponent
  ],
  imports: [
    // App modules - Routes
    AccountRoutingModule,

    // App modules
    CoreModule,
    SharedModule,

    // Others
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    
  ],
  providers: []
})
export class AccountModule { }
