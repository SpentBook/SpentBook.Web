// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Module
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageRegisterComponent } from './pages/page-register/page-register.component';
import { PageRegisterConfirmationComponent } from './pages/page-register-confirmation/page-register-confirmation.component';

const appRoutes: Routes = [
  { path: 'login', component: PageLoginComponent },
  { path: 'register', component: PageRegisterComponent },
  { path: 'register-confirmation', component: PageRegisterConfirmationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
