import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTodoProjectsComponent } from './dialog-todo-projects.component';

describe('DialogTodoProjectsComponent', () => {
  let component: DialogTodoProjectsComponent;
  let fixture: ComponentFixture<DialogTodoProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTodoProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTodoProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
