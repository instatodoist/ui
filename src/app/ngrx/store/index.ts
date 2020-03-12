import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { _todoReducer } from '../reducers/todo.reducer';
import { _errorReducer } from '../reducers/error.reducer';

import { RouterModule } from '@angular/router';
import {
  apolloReducer,
} from 'apollo-angular-cache-ngrx';

export interface State {
  apollo: any;
  todo: any;
  error: any;
}

export const reducers: ActionReducerMap<State> = {
  todo: _todoReducer,
  error: _errorReducer,
  apollo: apolloReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
