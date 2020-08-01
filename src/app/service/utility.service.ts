import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private translate: TranslateService,
    private iziToast: ToastrService
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get JQuery(): any {
    return $;
  }

  parseErrorMessage(message: any): string {
    let msg = message;
    if (message.match(/\[(.*?)\]/)) {
      msg = message.match(/\[(.*?)\]/)[1] || 'Something went wrong';
      msg = msg.replace(/"/g, '');
      msg = msg.charAt(0).toUpperCase() + msg.slice(1);
    }
    return msg;
  }

  // error toaster
  toastrError(message: string): void {
    this.iziToast.error(this.parseErrorMessage(message));
  }

  // error toaster
  toastrWarning(message: string): void {
    this.iziToast.warning(this.parseErrorMessage(message));
  }

  // success Toastr
  toastrSuccess(message: string): void {
    this.iziToast.success(this.parseErrorMessage(message));
  }

  // destroy toaster
  toastrDismiss(): void {
    // this.iziToast.destroy();
  }

  // parse network Errors
  parseNetworkError(networkError: unknown): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  parseGraphQlError(graphQLErrors): string {
    const { message } = graphQLErrors[0];
    return message;
  }

}
