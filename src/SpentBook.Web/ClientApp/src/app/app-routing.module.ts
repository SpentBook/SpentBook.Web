import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageLoginComponent }  from './account/pages/page-login/page-login.component';

const appRoutes: Routes = [
  { path: '', component: PageLoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
