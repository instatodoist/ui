import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FrontRoutingModule } from './auth-routing.module'
import { AuthComponent } from './auth-login/auth.component';
import { FrontComponent } from '../shared/layout/front/front.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthVerifyComponent } from './auth-verify/auth-verify.component';
import { AuthForgotComponent } from './auth-forgot/auth-forgot.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    FrontComponent,
    AuthComponent,
    AuthRegisterComponent,
    AuthVerifyComponent,
    AuthForgotComponent,
    AuthResetPasswordComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FrontRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule
  ]
})

export class AuthModule { }
