import { TestBed, async, inject } from '@angular/core/testing';

import { CanActivateAuthenticateGuard } from './can-activate-authenticate.guard';

describe('CanActivateAuthenticateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateAuthenticateGuard]
    });
  });

  it('should ...', inject([CanActivateAuthenticateGuard], (guard: CanActivateAuthenticateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
