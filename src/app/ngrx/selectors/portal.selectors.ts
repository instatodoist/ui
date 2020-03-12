import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPortal from '../reducers/portal.reducer';

export const selectPortalState = createFeatureSelector<fromPortal.State>(
  fromPortal.portalFeatureKey
);
