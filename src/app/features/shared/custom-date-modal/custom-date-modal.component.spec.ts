import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateModalComponent } from './custom-date-modal.component';

describe('CustomDateModalComponent', () => {
  let component: CustomDateModalComponent;
  let fixture: ComponentFixture<CustomDateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDateModalComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
