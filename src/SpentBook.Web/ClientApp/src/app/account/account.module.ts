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


@NgModule({
  declarations: [
    PageLoginComponent,
    LoginComponent,
    PageLogoutComponent,
    PageRegisterComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ]
})
export class AccountModule { }
