import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService, UtilityService } from '../../../service';

@Component({
  selector: 'app-account-update',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.scss']
})
export class AccountUpdateComponent implements OnInit {

  formObj: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      firstname: [''],
      lastname: ['']
    });
    this.getProfile();
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
      this.authService.updateProfile(this.formObj.value).subscribe(() => {
        this.utilityService.toastrSuccess('Profile Info updated succesfully');
      });
    }
  }

}
