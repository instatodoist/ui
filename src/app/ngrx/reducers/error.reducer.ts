import { Action, createReducer, on } from '@ngrx/store';
import * as ErrorActions from '../actions/error.actions';

export const errorFeatureKey = 'error';

export interface ErrorState {
  error: any
}

export const initialState: ErrorState = {
  error: null
};

const errorReducer = createReducer(
  initialState,
  on(
    ErrorActions.loadErrors,
    (state, { data }) => {
      return data
    }
  ),
);

export function _errorReducer(state: ErrorState | undefined, action: Action) {
  return errorReducer(state, action);
}
