declare var iziToast: any;
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private translate: TranslateService) { }

  // error toaster
  toastrError(message: any, options?: any): void {
    var msg = this.translate.instant(message)
    iziToast.destroy();
    iziToast.error({
      position: 'topCenter',
      message: msg,
      timeout: (options && !options.timeout) ? false : 5000,
      overlay: (options && options.overlay) ? true : false,
      close: (options && !options.close) ? false : true
    });
  }

  // error toaster
  toastrWarning(message: any, options?: any): void {
    var msg = this.translate.instant(message)
    iziToast.destroy();
    iziToast.warning({
      position: 'topCenter',
      message: msg,
      timeout: (options && !options.timeout) ? false : 5000,
      overlay: (options && options.overlay) ? true : false,
      close: (options && !options.close) ? false : true
    });
  }

  // success Toastr
  toastrSuccess(message: any, options?: any): void {
    var msg = this.translate.instant(message)
    iziToast.destroy();
    iziToast.success({
      position: 'topCenter',
      message: msg,
      timeout: (options && !options.timeout) ? false : 5000,
      overlay: (options && options.overlay) ? true : false,
      close: (options && !options.close) ? false : true
    });
  }

  // destroy toaster
  toastrDismiss(): void {
    iziToast.destroy();
  }

}
