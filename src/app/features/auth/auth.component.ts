declare var mdc: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from './../../service/appconfig';
import { AuthService } from './../../service/auth.service';
import { LsService } from './../../service/ls.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  appData: any;
  loader: boolean;
  signinForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  
  constructor(private appConfig: AppConfig, private fb: FormBuilder, private authService: AuthService, private router: Router, private lsService:LsService) { }

  ngOnInit(): void {
    this.appConfig.appData.subscribe(data => {
      this.appData = data;
    });
  }

  // auth check after submit
  signIn(): void {
    this.loader = true;
    this.authService.signIn(this.signinForm.value).subscribe((response: any) => {
      const data = response.login;
      this.loader = false;
      this.lsService.setValue('isLoggedIn', true);
      this.lsService.setValue('__token', data.token);
      this.router.navigate(['tasks/inbox']);
    })
  }
}
