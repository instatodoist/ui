import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TodoListType, TodoSortType, TodoType } from '../../../models/todo.model';
import { TodoConditions } from '../../../models/todo.model';
import { TodoService } from '../../../service/todo/todo.service';
@Component({
  selector: 'app-todo-pending',
  templateUrl: '../todo-pending/todo-pending.component.html',
  styleUrls: ['./todo-pending.component.scss']
})
export class TodoPendingComponent implements OnInit {

  @ViewChild('dialog') dialog: TemplateRef<any>;
  loader = false;
  todos: TodoListType;
  isUpdate = false;
  isDelete = false;
  popupType: string;
  todo: TodoType;
  conditions: TodoConditions;
  TODOTYPES = {
    inbox: 'backlog',
    today: 'today',
    pending: 'pending',
    completed: 'completed',
  };
  todoCurrentType = this.TODOTYPES.pending;

  constructor(
    private toddService: TodoService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loader = true;
    this.conditions = this.getConditions(this.todoCurrentType);
    this.toddService.listTodos(this.conditions)
      .subscribe((data) => {
        this.todos = data;
        this.loader = false;
      });
  }

  getConditions(type: string): TodoConditions {
    return {
      sort: {
        updatedAt: 'DESC'
      },
      filter: {
        type: 'pending'
      }
    };
  }

  openPopUp(todo: TodoType, popupType): void {
    if (popupType === 'UPDATE') {
      this.isUpdate = true;
      this.popupType = 'UPDATE';
    } else {
      this.isDelete = true;
      this.popupType = 'DELETE';
    }
    this.todo = todo; // passing todo object to update dialog
  }

  updatePopupFlag($event: boolean): void {
    if (this.popupType === 'UPDATE') {
      this.isUpdate = $event;
    } else {
      this.isDelete = $event;
    }
  }

  updateTodo(todo: TodoType) {
    const postBody: TodoType = {
      _id: todo._id,
      isCompleted: true
    };
    this.toddService
      .updateTodo(postBody, this.conditions)
      .subscribe(response => {
        console.log(response);
      });
  }

}
