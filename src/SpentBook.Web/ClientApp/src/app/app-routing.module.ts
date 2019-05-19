// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App
import { AuthGuardService } from '@app/core';
import { PageHomeComponent } from '@app/dashboard';

const appRoutes: Routes = [
  { path: '', component: PageHomeComponent, canActivate: [AuthGuardService] },
  { path: 'teste', component: PageHomeComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  providers: [AuthGuardService],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
