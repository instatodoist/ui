import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FrontComponent } from './../../shared/layout/front/front.component';
import { CanActivateAuthenticateGuard } from '../../shared/guards/can-activate-authenticate.guard';
const authRoutes: Routes = [
  {
    canActivate: [CanActivateAuthenticateGuard],
    path: '', component: FrontComponent,
    children: [
      {
        path: '',
        component: AuthComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(authRoutes, { enableTracing: true })],
  exports: [RouterModule]
})
export class FrontRoutingModule { }
