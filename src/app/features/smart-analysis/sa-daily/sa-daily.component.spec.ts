import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaDailyComponent } from './sa-daily.component';

describe('SaDailyComponent', () => {
  let component: SaDailyComponent;
  let fixture: ComponentFixture<SaDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaDailyComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
