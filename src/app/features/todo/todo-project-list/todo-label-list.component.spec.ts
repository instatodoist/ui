import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoProjectListComponent } from './todo-project-list.component';

describe('TodoProjectListComponent', () => {
  let component: TodoProjectListComponent;
  let fixture: ComponentFixture<TodoProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoProjectListComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
