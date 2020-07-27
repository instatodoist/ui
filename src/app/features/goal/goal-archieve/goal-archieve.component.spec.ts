import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalArchieveComponent } from './goal-archieve.component';

describe('GoalArchieveComponent', () => {
  let component: GoalArchieveComponent;
  let fixture: ComponentFixture<GoalArchieveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalArchieveComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalArchieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
