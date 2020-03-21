import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LsService } from './../../../service/ls.service';
import { ActivatedRoute } from '@angular/router'
import { filter, map } from 'rxjs/operators'
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent {

  tabTitle = 'InstaTodo';
  headerTitle: string;
  isOpen = false;

  constructor(
    private router: Router,
    private lsService: LsService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService
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
  }

  // do singout
  signOut(): boolean {
    this.lsService.clearAll();
    this.router.navigate(['/']);
    return false;
  }

  // change language
  useLanguage(language: string) {
    this.translate.use(language);
  }

  closePopUp($event: boolean): void {
    this.isOpen = $event;
  }

  openPopUp(): void {
    this.isOpen = true;
  }


}
