declare var mdc: any;
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
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from './service/utility.service';
import { VersionCheckService } from './service/version-check/version-check.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'InstaTodo';
  loading = false;
  constructor(
    translate: TranslateService,
    private router: Router,
    private titleService: Title,
    private utilityService: UtilityService,
    private versionCheckService: VersionCheckService
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
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          mdc.autoInit(document, () => { });
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit(): void {
    if (environment.production) {
      this.versionCheckService.initVersionCheck(environment.versionUrl);
    }
    this.titleService.setTitle(this.title);
    // network checking
    this.createOnline$().subscribe(isOnline => {
      !isOnline ?
      this.utilityService.toastrWarning('Network is down', { close: false, timeout: false, overlay: true }) :
      this.utilityService.toastrSuccess('Network is up');
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
}
