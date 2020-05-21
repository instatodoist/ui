import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../features/shared/shared.module';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { PasswordUpdateComponent } from './password-update/password-update.component';
import { AccountUpdateComponent } from './account-update/account-update.component';


@NgModule({
  declarations: [
    ProfileUpdateComponent,
    PasswordUpdateComponent,
    AccountUpdateComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
