import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth-login/auth.component';
import { FrontComponent } from '../shared/layout/front/front.component';
import { HomeLayoutComponent } from '../shared/layout/home-layout/home-layout.component';
import { CanActivateAuthenticateGuard } from '../../guards/can-activate-authenticate.guard';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthVerifyComponent } from './auth-verify/auth-verify.component';
import { AuthForgotComponent } from './auth-forgot/auth-forgot.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';
import { HomeComponent } from './home/home.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const authRoutes: Routes = [
  {
    canActivate: [CanActivateAuthenticateGuard],
    path: 'auth',
    component: FrontComponent,
    children: [
      {
        path: 'login',
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
  },
  {
    canActivate: [CanActivateAuthenticateGuard],
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'terms',
        component: TermsConditionsComponent
      },
      {
        path: 'contacts-us',
        component: ContactUsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(authRoutes, { enableTracing: true })],
  exports: [RouterModule]
})
export class FrontRoutingModule { }
