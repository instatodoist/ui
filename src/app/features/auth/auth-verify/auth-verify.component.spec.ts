import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthVerifyComponent } from './auth-verify.component';

describe('AuthVerifyComponent', () => {
  let component: AuthVerifyComponent;
  let fixture: ComponentFixture<AuthVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
