import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth-login/auth.component';
import { FrontComponent } from '../shared/layout/front/front.component';
import { CanActivateAuthenticateGuard } from '../../guards/can-activate-authenticate.guard';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthVerifyComponent } from './auth-verify/auth-verify.component';
import { AuthForgotComponent } from './auth-forgot/auth-forgot.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';

const authRoutes: Routes = [
  {
    canActivate: [CanActivateAuthenticateGuard],
    path: '',
    component: FrontComponent,
    children: [
      {
        path: '',
        component: AuthComponent,
      },
      {
        path: 'forgot-password',
        component: AuthForgotComponent,
      },
      {
        path: 'forgot-password/confirmation/:hash',
        component: AuthVerifyComponent,
      },
      {
        path: 'reset-password/:hash',
        component: AuthResetPasswordComponent,
      },
      {
        path: 'register',
        component: AuthRegisterComponent,
      },
      {
        path: 'verification/:hash',
        component: AuthVerifyComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(authRoutes, { enableTracing: true })],
  exports: [RouterModule]
})
export class FrontRoutingModule { }
