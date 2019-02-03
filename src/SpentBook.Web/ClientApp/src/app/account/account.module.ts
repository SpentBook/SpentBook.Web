import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageLogoutComponent } from './pages/page-logout/page-logout.component';
import { PageRegisterComponent } from './pages/page-register/page-register.component';

@NgModule({
  declarations: [
    PageLoginComponent,
    PageLogoutComponent,
    PageRegisterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AccountModule { }
