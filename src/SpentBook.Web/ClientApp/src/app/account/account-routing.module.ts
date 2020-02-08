// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Module
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageRegisterComponent } from './pages/page-register/page-register.component';
import { PageRegisterConfirmationComponent } from './pages/page-register-confirmation/page-register-confirmation.component';
import { PageForgotPasswordComponent } from './pages/page-forgot-password/page-forgot-password.component';
import { PageChangePasswordComponent } from "./pages/page-change-password/page-change-password.component";
import { PageProfileComponent } from './pages/page-profile/page-profile.component';
import { PageProfileChangePwdComponent } from './pages/page-profile-change-pwd/page-profile-change-pwd.component';

// App
import { AuthGuardService } from '@app/core';
import { PageUnregisterComponent } from './pages/page-unregister/page-unregister.component';

const appRoutes: Routes = [
  { path: 'login', component: PageLoginComponent },
  { path: 'register', component: PageRegisterComponent },
  { path: 'register-confirmation', component: PageRegisterConfirmationComponent },
  { path: 'forgot-password', component: PageForgotPasswordComponent },
  { path: 'change-password', component: PageChangePasswordComponent },
  { path: 'profile', component: PageProfileComponent, canActivate: [AuthGuardService] },
  { path: 'profile/change-password', component: PageProfileChangePwdComponent, canActivate: [AuthGuardService] },
  {
    path: 'profile/unregister',
    component: PageUnregisterComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: ['delete']
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
