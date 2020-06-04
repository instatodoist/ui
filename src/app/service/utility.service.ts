import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private translate: TranslateService,
    private iziToast: ToastrService
  ) { }

  parseErrorMessage(message) {
    let msg = message;
    if (message.match(/\[(.*?)\]/)) {
      msg = message.match(/\[(.*?)\]/)[1] || 'Something went wrong';
      msg = msg.replace(/"/g, '');
      msg = msg.charAt(0).toUpperCase() + msg.slice(1);
    }
    return msg;
  }

  // error toaster
  toastrError(message: any, options?: any): void {
    this.iziToast.error(this.parseErrorMessage(message));
    // const msg = this.translate.instant(message);
    // this.iziToast.destroy();
    // this.iziToast.error(message, {
    //   // position: 'topCenter',
    //   // timeout: (options && !options.timeout) ? false : 5000,
    //   // overlay: (options && options.overlay) ? true : false,
    //   // close: (options && !options.close) ? false : true
    // });
  }

  // error toaster
  toastrWarning(message: any, options?: any): void {
    this.iziToast.warning(this.parseErrorMessage(message));
    // const msg = this.translate.instant(message)
    // this.iziToast.destroy();
    // this.iziToast.warning({
    //   position: 'topCenter',
    //   message,
    //   timeout: (options && !options.timeout) ? false : 5000,
    //   overlay: (options && options.overlay) ? true : false,
    //   close: (options && !options.close) ? false : true
    // });
  }

  // success Toastr
  toastrSuccess(message: any, options?: any): void {
    this.iziToast.success(this.parseErrorMessage(message));
    // const msg = this.translate.instant(message);
    // this.iziToast.destroy();
    // this.iziToast.success({
    //   position: 'topCenter',
    //   message,
    //   timeout: (options && !options.timeout) ? false : 5000,
    //   overlay: (options && options.overlay) ? true : false,
    //   close: (options && !options.close) ? false : true
    // });
  }

  // destroy toaster
  toastrDismiss(): void {
    // this.iziToast.destroy();
  }

  // parse network Errors
  parseNetworkError(networkError): string {
    const { error }: any = networkError;
    let finalObj = null;
    try {
      if (!Array.isArray(error.errors)) {
        finalObj = error;
      } else {
        const errors = error.errors[0];
        finalObj = errors;
      }
    } catch (error) {
        return 'Something Went Wrong';
    }
    const { status, code, message } = finalObj;
    // Checking Error codes
    if (status && code !== 'ValidationError') {
      switch (status) {
        case 401:
          return 'LOGOUT';
        default:
      }
    }
    // parsing error message
    let msg = message;
    if (message.match(/\[(.*?)\]/)) {
      msg = message.match(/\[(.*?)\]/)[1] || 'Something went wrong';
      msg = msg.replace(/"/g, '');
      msg = msg.charAt(0).toUpperCase() + msg.slice(1);
    }
    return msg;
  }

  // parse GraphQl Errors
  parseGraphQlError(graphQLErrors): string {
    const { message } = graphQLErrors[0];
    return message;
  }

}
