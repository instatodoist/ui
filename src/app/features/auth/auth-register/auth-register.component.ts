declare var mdc: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../../../service/appconfig';
import { AuthService } from '../../../service/auth/auth.service';
import { LsService } from '../../../service/ls.service';
import { UserModel } from '../../../models';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss']
})
export class AuthRegisterComponent implements OnInit {

  appData: any;
  loader: boolean;
  signinForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private appConfig: AppConfig,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private lsService: LsService ) { }

  ngOnInit(): void {
    // this.appConfig.appData.subscribe(data => {
    //   this.appData = data;
    // });
  }

  // auth check after submit
  register(): void {
    this.loader = true;
    this.authService.register(this.signinForm.value).subscribe((response: UserModel.RegisterResponse) => {
      const data = response;
      this.loader = false;
    });
  }

}
