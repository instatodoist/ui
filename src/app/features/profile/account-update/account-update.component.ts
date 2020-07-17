import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService, UtilityService, AppService } from '../../../service';

@Component({
  selector: 'app-account-update',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.scss']
})
export class AccountUpdateComponent implements OnInit, AfterViewInit {

  formObj: FormGroup;
  defaultProfileImage = this.appService.defautProfileImage;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private authService: AuthService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      firstname: [''],
      lastname: [''],
      profileImg: [null]
    });
    this.getProfile();
    this.formObj.get('profileImg').valueChanges.subscribe((item) => {
      console.log(item);
    });
  }

  ngAfterViewInit() {

  }

  getProfile() {
    this.authService.profile().subscribe((data) => {
      this.formObj.patchValue({
        firstname: data.firstname,
        lastname: data.lastname
      });
    });
  }

  submit() {
    if (this.formObj.valid && this.formObj.dirty) {
      const { profileImg, ...postBody } = this.formObj.value;
      if (profileImg) {
        postBody.image = profileImg;
      }
      console.log(postBody);
      this.authService.updateProfile(postBody).subscribe(() => {
        this.utilityService.toastrSuccess('Profile Info updated succesfully');
      });
    }
  }
}
