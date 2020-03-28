import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoLabelFilterComponent } from './todo-label-filter.component';

describe('TodoLabelFilterComponent', () => {
  let component: TodoLabelFilterComponent;
  let fixture: ComponentFixture<TodoLabelFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoLabelFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoLabelFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
