import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService, AppService, UtilityService } from '../../../../service';
import { Subscription } from 'rxjs';
import { ILanguage, IUserProfile } from '../../../../models';
import { TodoDialogComponent } from '../../../todo/todo-dialog/todo-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  tabTitle = 'InstaTodo';
  headerTitle: string;
  session: IUserProfile;
  formObj: FormGroup;
  languages$: Subscription;
  languages: ILanguage[] = [];
  defaultLang: ILanguage = null;
  defaultProfileImage = this.appService.defautProfileImage;

  constructor(
    private router: Router,
    private userService: AuthService,
    private fb: FormBuilder,
    private authService: AuthService,
    private appService: AppService,
    private utilityService: UtilityService,
    private modalService: NgbModal
  ) {
    this.formObj = this.fb.group({
      query: ['']
    });
    const urlTree = this.router.parseUrl(this.router.url);
    if (urlTree.queryParams.q) {
      this.formObj.patchValue({
        query: urlTree.queryParams.q
      });
    }
    this.appService.APP_LEVEL.subscribe(({ session }) => {
      this.session = session;
    });
  }

  ngOnInit(): void {
    this.getProfile();
    this.onSearch();
  }

  // do singout
  signOut(): boolean {
    this.authService.logout();
    this.router.navigate(['/']);
    return false;
  }

  /**
   * open popup
   */
  openPopUp(): void {
    // this.utilityService.openMdcDialog({
    //   type: 'component',
    //   value: TodoDialogComponent,
    //   data: {
    //     modelId: 'todo-dialog'
    //   }
    // })
    //   .subscribe((_)=>_);
    this.modalService.open(TodoDialogComponent, {size: 'lg'});
  }

  /**
   * fectch user profile
   */
  getProfile(): void {
    this.userService.profile()
      .subscribe(data => {
        this.session = data;
        // eslint-disable-next-line no-underscore-dangle
        this.appService.__updateCoreAppData({
          ...this.appService.APP_DATA,
          session: this.session
        });
      });
  }

  /**
   * search content specific to the current routes
   */
  onSearch(): void {
    this.formObj.get('query').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((query) => {
      const urlTree = this.router.createUrlTree([], {
        queryParams: { q: query ? query : null },
        queryParamsHandling: 'merge',
        preserveFragment: true
      });
      return this.router.navigateByUrl(urlTree);
    });
  }

}
