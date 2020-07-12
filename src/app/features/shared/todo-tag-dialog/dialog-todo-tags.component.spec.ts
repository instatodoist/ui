import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTodoTagsComponent } from './dialog-todo-tags.component';

describe('DialogTodoTagsComponent', () => {
  let component: DialogTodoTagsComponent;
  let fixture: ComponentFixture<DialogTodoTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTodoTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTodoTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
