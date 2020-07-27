import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { VersionCheckService, AppService } from './service';
import { IExternalModal } from './models';
import { environment } from '../environments/environment';
import { of } from 'rxjs';

// declare ga as a function to set and sent the events
declare let gtag: (arg0: string, arg1: string, arg2?: string, arg3?: string) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: Window, useValue: window }
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  loading = false;
  extModalConfig: IExternalModal;
  modalSubscription: Subscription;
  routerEventSubscription: Subscription;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private versionCheckService: VersionCheckService,
    private appService: AppService,
    private activatedRoute: ActivatedRoute
  ) {
    translateService.setDefaultLang('en'); // set default lang as english
    this.routerEventSubscription = this.router
      .events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        switchMap((event: NavigationEnd) => {
          if (environment.production) { // send analytics
            gtag('set', 'page', event.urlAfterRedirects);
            gtag('send', 'pageview');
          }
          window.scroll(0, 0); // scroll to top on route change
          this.appService.updateCurentUrl(this.router.url); // update current url via through Behaviour Subject
          return of(true);
        }),
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
      ).subscribe(title => {
        if (title) {
          this.translateService.get(title).subscribe(titleText => {
            this.appService.configureSeo(titleText);
          });
        }
      });
    this.setMetaTags();
  }

  ngOnInit(): void {
    this.subscribeToExtTodoAddModal();
    if (environment.production) {
      this.versionCheckService.initVersionCheck(environment.versionUrl, 30 * 1000);
    }
  }

  // used for open & closing of todo add modal
  private subscribeToExtTodoAddModal() {
    this.modalSubscription = this.appService.externalModal.subscribe(data => {
      this.extModalConfig = data;
    });
  }

  private setMetaTags() {
    this.appService.configureSeo('Enhance Productivity', [
      {
        name: 'description',
        content: 'Enhance your Productivity & make your life more better Organize yourself you never experienced ever.'
      },
      { name: 'keywords', content: 'Todo, Tasks, Productivity, work' },
      { charset: 'UTF-8' }
    ]);
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.modalSubscription.unsubscribe();
  }
}
