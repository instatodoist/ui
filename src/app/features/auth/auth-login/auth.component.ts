import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LsService, AuthService, AppService } from '../../../service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loader: boolean;
  isSubmit = false;
  signinForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private lsService: LsService,
    private appService: AppService
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
}
