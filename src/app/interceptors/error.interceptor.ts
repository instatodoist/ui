import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs/index';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(
        catchError((errors: HttpErrorResponse) => {
            const {
                error,
                headers,
                url,
                name,
                message,
                ok,
                status,
                statusText
            } = errors;
            const errObject = {
                error,
                headers,
                status,
                statusText,
                name,
                message,
                ok,
                url: url || undefined,
            };
            return throwError(errObject);
        })
      )
  }

}
