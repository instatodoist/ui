import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class AppConfig {
  appData: BehaviorSubject<any>;
  constructor() {
    this.appData = new BehaviorSubject({});
  }
  updateAppData(data) {
    this.appData.next(data);
  }

  get defaultSettings() {
    return {
      app: {
        theme: localStorage.getItem('defaultTheme') || 'rgb(30, 61, 115)'
      }
    };
  }

  changeTheme(iqColor: any) {
    console.log(iqColor);
    localStorage.setItem('defaultTheme', iqColor);
    const str = iqColor;
    const res = str.replace('rgb(', '');
    const res1 = res.replace(')', '');
    const iqColor2 = 'rgba(' + res1.concat(',', 0.1) + ')';
    const iqColor3 = 'rgba(' + res1.concat(',', 0.8) + ')';
    document.documentElement.style.setProperty('--iq-primary', iqColor);
    document.documentElement.style.setProperty('--iq-light-primary', iqColor2);
    document.documentElement.style.setProperty('--iq-primary-hover', iqColor3);
  }

  get loaderImage() {
    return '/assets/facelift/images/page-img/page-load-loader.gif';
  }
}
