import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoInboxComponent } from './todo-inbox.component';

describe('TodoInboxComponent', () => {
  let component: TodoInboxComponent;
  let fixture: ComponentFixture<TodoInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoInboxComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
