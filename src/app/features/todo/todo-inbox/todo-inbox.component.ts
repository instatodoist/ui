import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TodoListType, TodoSortType, TodoType } from '../../../models/todo.model';
import {  TodoConditions } from '../../../models/todo.model';
import { TodoService } from '../../../service/todo/todo.service';
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss'],
})
export class TodoInboxComponent implements OnInit {
  @ViewChild('dialog') dialog: TemplateRef<any>;
  loader = false;
  todos: TodoListType;
  isUpdate = false;
  todo: TodoType;

  constructor(private toddService: TodoService) {
  }

  ngOnInit(): void {
    this.loader = true;
    const conditions: TodoConditions = {
      sort: {
        updatedAt: 'DESC'
      },
      filter: {
        isCompleted: false
      }
    };
    this.toddService.listTodos(conditions)
      .subscribe((data) => {
        this.todos = data;
        this.loader = false;
    });
  }

  openUpdatePopUp(todo: TodoType): void {
    this.isUpdate = true;
    this.todo = todo; // passing todo object to update dialog
  }

  updatePopupFlag($event : boolean): void {
    this.isUpdate = $event;
  }
}
