import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {LsService} from '../service/ls.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lsService = this.injector.get(LsService);
    if (lsService.getValue('isLoggedIn')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${lsService.getValue('__token')}`
        }
      });
    }
    return next.handle(request);
  }
}
