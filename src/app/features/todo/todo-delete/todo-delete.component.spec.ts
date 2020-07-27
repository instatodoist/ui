import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDeleteComponent } from './todo-delete.component';

describe('TodoDeleteComponent', () => {
  let component: TodoDeleteComponent;
  let fixture: ComponentFixture<TodoDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoDeleteComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
