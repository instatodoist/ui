import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoLabelListComponent } from './todo-label-list.component';

describe('TodoLabelListComponent', () => {
  let component: TodoLabelListComponent;
  let fixture: ComponentFixture<TodoLabelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoLabelListComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoLabelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
