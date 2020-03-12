import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs/index';
import {ErrorState} from '../ngrx/reducers/error.reducer';
import {Store} from '@ngrx/store';
import {loadErrors} from '../ngrx/actions/error.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<ErrorState>
  ) {}

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
            }
            this.store.dispatch(loadErrors({ data: errObject }));
            return throwError(errObject);
        })
      )
  }

}
