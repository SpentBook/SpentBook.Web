import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './account/services/auth-guard.service';
import { PageHomeComponent } from './dashboard/page-home/page-home.component';
import { PageLoginComponent } from './account/pages/page-login/page-login.component';

const appRoutes: Routes = [
  { path: '', component: PageHomeComponent, canActivate: [AuthGuardService] },
  { path: 'teste', component: PageHomeComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  providers: [AuthGuardService],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
