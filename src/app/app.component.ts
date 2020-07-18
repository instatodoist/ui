import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import {
  Router,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart
} from '@angular/router';
import { Observable, Observer, fromEvent, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService, VersionCheckService, AppService } from './service';
import { IExternalModal } from './models';
import { environment } from '../environments/environment';
declare var $: any;
// declare ga as a function to set and sent the events
declare var gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: Window, useValue: window }
  ]
})
export class AppComponent implements OnInit {

  title = 'InstaTodo';
  loading = false;
  extModalConfig: IExternalModal;
  modalSubscription: Subscription;

  constructor(
    private window: Window,
    translate: TranslateService,
    private router: Router,
    private titleService: Title,
    private utilityService: UtilityService,
    private versionCheckService: VersionCheckService,
    private appService: AppService
  ) {
    // set default lang as english
    translate.setDefaultLang('en');
    // Add Analytics
    // setting navigation start/end status
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        window.scroll(0, 0); // scroll to top on route change
        this.appService.updateCurentUrl(this.router.url);
        // console.log(gTag)
        if (environment.production) {
          gtag('set', 'page', event.urlAfterRedirects);
          gtag('send', 'pageview');
        }
      }
      if (event instanceof NavigationError) {
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.subscribeToExtTodoAddModal();
    if (environment.production) {
      this.versionCheckService.initVersionCheck(environment.versionUrl, 30 * 1000);
    }
    this.titleService.setTitle(this.title);
    // network checking
    this.createOnline$().subscribe(isOnline => {
      !isOnline ?
        this.utilityService.toastrWarning('Network is down', { close: false, timeout: false, overlay: true }) : null;
      // this.utilityService.toastrSuccess('Network is up');
    });
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

  // used for open & closing of todo add modal
  private subscribeToExtTodoAddModal() {
    this.modalSubscription = this.appService.externalModal.subscribe(data => {
      this.extModalConfig = data;
    });
  }

}
