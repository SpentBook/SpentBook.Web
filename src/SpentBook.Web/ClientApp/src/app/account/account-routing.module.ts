import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageLoginComponent }  from './pages/page-login/page-login.component';
import { PageRegisterComponent }  from './pages/page-register/page-register.component';

const appRoutes: Routes = [
  { path: 'login', component: PageLoginComponent },
  { path: 'register', component: PageRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
