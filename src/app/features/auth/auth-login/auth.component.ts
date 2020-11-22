import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import {  GoogleLoginProvider } from 'angularx-social-login';
import { LsService, AuthService, AppService } from '../../../service';
import { IUserProfile } from '../../../models';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isGoogleLogin = false;
  loader: boolean;
  isSubmit = false;
  signinForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private lsService: LsService,
    private appService: AppService,
    private socialService: SocialAuthService
  ) { }

  ngOnInit(): void {}

  // auth check after submit
  signIn(): void {
    this.loader = true;
    this.isSubmit = true;
    this.authService.signIn(this.signinForm.value)
      .subscribe(
        (response: any) => {
          const data = response.login;
          this.loader = false;
          this.lsService.setValue('isLoggedIn', true);
          this.lsService.setValue('__token', data.token);
          // this.router.navigate(['tasks/today']);
          // Kind of hack will fix after for the timebeing
          window.location.reload();
        },
        () => {
          this.isSubmit = false;
          this.loader = false;
        }
      );
  }

  signInWithGoogle(): void {
    try {
      this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID);
      this.socialService.authState
        .subscribe((user) => {
          this.isGoogleLogin = true;
          const postBody: IUserProfile  = {
            firstname: user.firstName,
            lastname: user.lastName || '',
            email: user.email,
            gID: user.id,
            profile_image: user.photoUrl
          };
          this.authService.googleLogin(postBody)
            .subscribe(
              data=>{
                this.lsService.setValue('isLoggedIn', true);
                this.lsService.setValue('__token', data.token);
                window.location.reload();
              },
              ()=>{
                this.isGoogleLogin = false;
              }
            );
        });
    } catch(err) {
      console.log(err);
    }
  }
}
