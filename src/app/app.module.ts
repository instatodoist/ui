import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule } from '@angular/router';
import { AuthModule } from './features/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule} from './features/shared/shared.module';
import { GraphqlModule } from './features/graphql/graphql.module';

import { CanActivateAuthenticateGuard } from './guards/can-activate-authenticate.guard';

import { DropdownMenuDirective } from './directive/dropdown/dropdown-menu.directive';
import { FormValidationDirective } from './directive/form-validation.directive';

import { AppComponent } from './app.component';
import { AdminComponent } from './features/shared/layout/admin/admin.component';
import { HeaderComponent } from './features/shared/section/header/header.component';
import { FooterComponent } from './features/shared/section/footer/footer.component';
import { SidebarComponent } from './features/shared/section/sidebar/sidebar.component';
import { PageNotFoundComponent } from './features/shared/page-not-found/page-not-found.component';
import { HomeLayoutComponent } from './features/shared/layout/home-layout/home-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    PageNotFoundComponent,
    FormValidationDirective,
    DropdownMenuDirective,
    HomeLayoutComponent
  ],
  imports: [
    BrowserModule,
    GraphqlModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AuthModule,
    AppRoutingModule,
    SharedModule,
    // HomeModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanActivateAuthenticateGuard
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
