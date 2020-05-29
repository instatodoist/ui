declare var $: any;
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'InstaTodo';
  loading = false;
  extModalConfig: IExternalModal;
  modalSubscription: Subscription;

  constructor(
    translate: TranslateService,
    private router: Router,
    private titleService: Title,
    private utilityService: UtilityService,
    private versionCheckService: VersionCheckService,
    private appService: AppService
  ) {
    // set default lang as english
    translate.setDefaultLang('en');
    // setting navigation start/end status
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
          window.scroll(0, 0); // scroll to top on route change
          this.appService.updateCurentUrl(this.router.url);
          break;
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.subscribeToExtTodoAddModal();
    if (environment.production) {
      this.versionCheckService.initVersionCheck(environment.versionUrl);
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
