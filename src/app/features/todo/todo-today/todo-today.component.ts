import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TodoListType, TodoSortType } from '../../../models/todo.model';
import {  TodoConditions } from '../../../models/todo.model';
import { TodoService } from '../../../service/todo/todo.service';
@Component({
  selector: 'app-todo-today',
  templateUrl: './todo-today.component.html',
  styleUrls: ['./todo-today.component.scss']
})
export class TodoTodayComponent implements OnInit {

  loader: boolean;
  todos: TodoListType;

  constructor(private toddService: TodoService) { }

  ngOnInit(): void {
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
    });
  }

}
