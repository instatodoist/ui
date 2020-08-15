/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, ViewContainerRef, ComponentRef, Injector, ComponentFactoryResolver, TemplateRef, ViewRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IDialogRef, TDialogTempRef, TDialogCompRef} from '../models';
import { Observable } from 'apollo-link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  vcRef: ViewContainerRef;

  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
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

  /**
   * register vc for appcomponets on load
   * @param vc - view containerref
   */
  registerAppCOntainerViewRef(vc: ViewContainerRef): void {
    this.vcRef = vc;
  }

  /**
   * Create a component instance from params [ComponentRef]
   * @param ref - ComponentRef
   */
  createComponentOutlet(ref: TDialogCompRef): any {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ref.value);
    const componentRef: ComponentRef<any> = factory.create(this.injector);
    if (ref?.data) {
      (Object.keys(ref?.data)).forEach(element => {
        if (element in ref?.data) {
          componentRef.instance[element] = ref?.data[element];
        }
      });
    }
    const view = componentRef.hostView;
    this.insertInAppViewContainer(view);
    return componentRef.instance;
  }

  /**
   * Create a template reference from param [TemplateRef]
   * @param ref - TemplateRef
   */
  createTemplateRef(ref: TDialogTempRef): void {
    const temRef: TemplateRef<any> = ref.value;
    const view = temRef.createEmbeddedView(null);
    this.insertInAppViewContainer(view);
  }

  /**
   * Insert ComponentRef & TemplateRef in the APP ViewContanerRef
   * @param view - TemplateRef | ComponentRef
   */
  insertInAppViewContainer(view: ViewRef): void {
    this.vcRef.insert(view);
  }

  /**
   * Passing ComponentRef | TemplateRef to open as a dialog
   * @param ref - TemplateRef | ComponentRef
   */
  openMdcDialog(ref: IDialogRef): Observable<{dialog: any, instance: any}> {
    let instance: any;
    if (ref.type === 'template') {
      instance = this.createTemplateRef(ref);
    } else {
      instance = this.createComponentOutlet(ref);
    }
    return this.triggerMdcDialog(instance, ref.data.modelId);
  }

  /**
   * Open ComponentRef | TemplateRef as a dialog
   */
  triggerMdcDialog(instance: any, modelId: string): Observable<{dialog: any, instance: any}> {
    return new Observable((observer) => {
      setTimeout(()=>{
        const dialog = $(`#${modelId}`);
        dialog.modal('toggle'); // Open & close Popup
        // instance.dialog = dialog;
        dialog.on('hidden.bs.modal', () => { // listen modal close event
          this.vcRef.clear();
        });
        observer.next({ dialog, instance });
      },0);
    });
  }

  /**
   * Close MDC Dialog
   * @param dialog - MDCDialog
   */
  closeMdcDialog(dialog: any): void {
    dialog.close();
    this.vcRef.clear();
  }


}
