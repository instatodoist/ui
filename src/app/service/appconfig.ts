import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IExternalModal } from './../models';

@Injectable({
    providedIn: 'root',
})

export class AppConfig {
  appData: BehaviorSubject<any>;
  externalModal: BehaviorSubject<IExternalModal>;
  ExternalModelConfig: IExternalModal = {
    TODO_ADD: false,
    TODO_UPDATE: false
  };

  constructor() {
    this.appData = new BehaviorSubject({});
    // initialize the modal config
    this.externalModal = new BehaviorSubject(this.ExternalModelConfig);
  }

  updateExternalModal(obj: IExternalModal) {
    this.externalModal.next(obj);
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
