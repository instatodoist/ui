import * as fromPortal from '../reducers/portal.reducer';
import { selectPortalState } from './portal.selectors';

describe('Portal Selectors', () => {
  it('should select the feature state', () => {
    const result = selectPortalState({
      [fromPortal.portalFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
