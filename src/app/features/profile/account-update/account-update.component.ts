import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService, UtilityService } from '../../../service';

@Component({
  selector: 'app-account-update',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.scss']
})
export class AccountUpdateComponent implements OnInit, AfterViewInit {

  formObj: FormGroup;
  src = '/assets/facelift/images/user/11.png';

  constructor(
    private fb: FormBuilder,
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
        postBody.profileImg = profileImg;
      }
      console.log(postBody);
      this.authService.updateProfile(postBody).subscribe(() => {
        this.utilityService.toastrSuccess('Profile Info updated succesfully');
      });
    }
  }
}
