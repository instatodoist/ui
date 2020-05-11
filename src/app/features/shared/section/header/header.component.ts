import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, AppService } from '../../../../service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  tabTitle = 'InstaTodo';
  headerTitle: string;
  session: any;
  formObj: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService,
    private userService: AuthService,
    private fb: FormBuilder,
    private authService: AuthService,
    private appService: AppService
  ) {
    this.router
      .events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data && child.snapshot.data.header_title) {
              return child.snapshot.data.header_title;
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe((title: any) => {
        this.headerTitle = title;
        // tslint:disable-next-line: no-shadowed-variable
        this.translate.get(title).subscribe(title => {
          this.titleService.setTitle(title + ' | ' + this.tabTitle);
        });
      });
    this.formObj = this.fb.group({
      query: ['']
    });
    const urlTree = this.router.parseUrl(this.router.url);
    if (urlTree.queryParams.q) {
      this.formObj.patchValue({
        query: urlTree.queryParams.q
      });
    }
  }

  ngOnInit() {
    this.getProfile();
  }

  // do singout
  signOut(): boolean {
    this.authService.logout();
    this.router.navigate(['/']);
    return false;
  }

  // change language
  useLanguage(language: string) {
    this.translate.use(language);
  }

  openPopUp(): void {
    this.appService.updateExternalModal({
      ...this.appService.ExternalModelConfig,
      TODO_ADD: true
    });
  }

  getProfile() {
    this.userService.profile()
      .subscribe(data => {
        this.session = data;
      });
  }

  onSearch() {
    const urlTree = this.router.createUrlTree([], {
      queryParams: { q: this.formObj.value.query ? this.formObj.value.query : null },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.router.navigateByUrl(urlTree);
  }
}
