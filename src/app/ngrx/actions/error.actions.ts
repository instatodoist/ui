import { createAction, props } from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';

export const loadErrors = createAction(
  '[Error] Load Errors',
  props<{ data: any }>()
);
