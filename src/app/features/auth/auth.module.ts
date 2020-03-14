import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FrontRoutingModule } from './auth-routing.module'
import { AuthComponent } from './auth-login/auth.component';
import { FrontComponent } from './../../shared/layout/front/front.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthVerifyComponent } from './auth-verify/auth-verify.component';

@NgModule({
  declarations: [
    FrontComponent,
    AuthComponent,
    AuthRegisterComponent,
    AuthVerifyComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FrontRoutingModule
  ]
})

export class AuthModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}