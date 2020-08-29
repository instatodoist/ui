import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { AuthModule } from './features/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './features/shared/shared.module';
import { GraphqlModule } from './features/graphql/graphql.module';
import { GoogleAnalyticService } from './service/analytics/google-analytic.service';

import { CanActivateAuthenticateGuard } from './guards/can-activate-authenticate.guard';

import { FormValidationDirective } from './directive/form-validation.directive';

import { AppComponent } from './app.component';
import { AdminComponent } from './features/shared/layout/admin/admin.component';
import { HeaderComponent } from './features/shared/section/header/header.component';
import { ThemeComponent } from './features/shared/section/theme/theme.component';
import { SidebarComponent } from './features/shared/section/sidebar/sidebar.component';
import { PageNotFoundComponent } from './features/shared/page-not-found/page-not-found.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HeaderComponent,
    ThemeComponent,
    SidebarComponent,
    PageNotFoundComponent,
    FormValidationDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphqlModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    AppRoutingModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SocialLoginModule
  ],
  exports: [
    RouterModule,
    SharedModule
  ],
  providers: [
    CanActivateAuthenticateGuard,
    GoogleAnalyticService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GID)
          }        ]
      } as SocialAuthServiceConfig
    }
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
