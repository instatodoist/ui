import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppConfig } from '../../../service/appconfig';
import { AuthService } from '../../../service/auth/auth.service';
import { UserModel } from '../../../models';
@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {

  isSubmit = false;
  appData: any;
  loader: boolean;
  formObj: FormGroup;

  constructor(
    private appConfig: AppConfig,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      password: ['', Validators.required],
      hashToken: ['', Validators.required],
    });
    this.appConfig.appData.subscribe(data => {
      this.appData = data;
    });
    this.activatedRoute.params.subscribe((params) => {
      this.formObj.patchValue({
        hashToken: params.hash
      });
      console.log(this.formObj.value);
    });
  }

  // auth check after submit
  submit(): void {
    this.loader = true;
    this.isSubmit = true;
    this.authService.resetPassword(this.formObj.value)
    .subscribe(() => {
      this.loader = false;
      this.isSubmit = false;
      this.router.navigate(['/']);
    },
    () => {
      this.isSubmit = false;
      this.loader = false;
    });
  }

}
