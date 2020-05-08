import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../../../service/appconfig';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-auth-forgot',
  templateUrl: './auth-forgot.component.html',
  styleUrls: ['./auth-forgot.component.scss']
})
export class AuthForgotComponent implements OnInit {

  isSubmit = false;
  appData: any;
  loader: boolean;
  signinForm = this.fb.group({
    email: ['', Validators.required]
  });

  constructor(
    private appConfig: AppConfig,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.appConfig.appData.subscribe(data => {
      this.appData = data;
    });
  }

  // auth check after submit
  submit(): void {
    this.loader = true;
    this.isSubmit = true;
    this.authService.forgotPassword(this.signinForm.value)
      .subscribe(
        (response: any) => {
          const data = response;
          this.router.navigate(['forgot-password/confirmation', data.hashToken]);
          this.loader = false;
          this.isSubmit = false;
        },
        () => {
          this.loader = false;
          this.isSubmit = false;
        }
      );
  }
}
