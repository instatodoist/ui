import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Router,
  Event,
  NavigationEnd,
} from '@angular/router';
import { Observable, Observer, fromEvent, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService, VersionCheckService, AppService } from './service';
import { IExternalModal } from './models';
import { environment } from '../environments/environment';
declare var $: any;
// declare ga as a function to set and sent the events
declare var gtag: (arg0: string, arg1: string, arg2?: string, arg3?: string) => void;

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
    translate: TranslateService,
    private router: Router,
    private utilityService: UtilityService,
    private versionCheckService: VersionCheckService,
    private appService: AppService
  ) {
    translate.setDefaultLang('en'); // set default lang as english
    this.routerEventSubscription = this.router.events.subscribe((event: Event) => { // setting navigation start/end status
      if (event instanceof NavigationEnd) {
        if (environment.production) { // send analytics
          gtag('set', 'page', event.urlAfterRedirects);
          gtag('send', 'pageview');
        }
        if (this.router.url === '/') {
          this.setMetaTags();
        }
        window.scroll(0, 0); // scroll to top on route change
        this.appService.updateCurentUrl(this.router.url); // update current url via through Behaviour Subject
      }
    });
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

  ngOnInit(): void {
    this.subscribeToExtTodoAddModal();
    if (environment.production) {
      this.versionCheckService.initVersionCheck(environment.versionUrl, 30 * 1000);
    }
    this.createOnline$().subscribe(isOnline => { // network checking
      !isOnline ?
        this.utilityService.toastrWarning('Network is down', { close: false, timeout: false, overlay: true }) : null;
      // this.utilityService.toastrSuccess('Network is up');
    });
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.modalSubscription.unsubscribe();
  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
}
