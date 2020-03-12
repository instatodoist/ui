import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { RouterModule } from '@angular/router';
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import {
  NgrxCacheModule,
  NgrxCache,
} from 'apollo-angular-cache-ngrx';


import { AuthModule } from './features/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { CanActivateAuthenticateGuard } from './shared/guards/can-activate-authenticate.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import { AppComponent } from './app.component';
import { AdminComponent } from './shared/layout/admin/admin.component';
import { HeaderComponent } from './shared/section/header/header.component';
import { FooterComponent } from './shared/section/footer/footer.component';
import { SidebarComponent } from './shared/section/sidebar/sidebar.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';

import { DropdownMenuDirective } from './directive/dropdown/dropdown-menu.directive';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { reducers, metaReducers } from './ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { FormValidationDirective } from './directive/form-validation.directive';
import { GraphQLModule } from './graphql.module';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    PageNotFoundComponent,
    FormValidationDirective,
    DropdownMenuDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ApolloModule,
    HttpLinkModule,
    AuthModule,
    AppRoutingModule,
    // StoreModule.forRoot({
    //   apollo: apolloReducer,
    // }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    NgrxCacheModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
    GraphQLModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanActivateAuthenticateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: environment.API_URL
        })
      }
    },
    deps: [HttpLink]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(ngrxCache: NgrxCache) {
    const cache = ngrxCache.create({});
  }
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}