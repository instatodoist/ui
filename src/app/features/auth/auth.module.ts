import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FrontRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { environment } from '../../../environments/environment';
// Components
// import { FooterComponent } from '../shared/section/footer/footer.component';
import { HomeLayoutComponent } from '../../layouts/home-layout/home-layout.component';
import { AuthComponent } from './auth-login/auth.component';
import { FrontComponent } from '../../layouts/front/front.component';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthVerifyComponent } from './auth-verify/auth-verify.component';
import { AuthForgotComponent } from './auth-forgot/auth-forgot.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';
import { HomeComponent } from './home/home.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    HomeLayoutComponent,
    FrontComponent,
    AuthComponent,
    AuthRegisterComponent,
    AuthVerifyComponent,
    AuthForgotComponent,
    AuthResetPasswordComponent,
    HomeComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    ContactUsComponent
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
