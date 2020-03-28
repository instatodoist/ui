import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TodoListType, TodoSortType, TodoType } from '../../../models/todo.model';
import { TodoConditions } from '../../../models/todo.model';
import { TodoService } from '../../../service/todo/todo.service';
import { SharedService } from '../../../service/shared/shared.service';
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
  todoCurrentType = this.TODOTYPES.inbox;
  isRefreshPendingList = false;

  constructor(
    private toddService: TodoService,
    private sharedService: SharedService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loader = true;
    if (this.router.url === '/tasks/today') {
      this.todoCurrentType = this.TODOTYPES.today;
    } else if (this.router.url === '/tasks/completed') {
      this.todoCurrentType = this.TODOTYPES.completed;
    } else if (this.router.url === '/tasks/inbox') {
      this.todoCurrentType = this.TODOTYPES.inbox;
    }
    this.conditions = this.getConditions(this.todoCurrentType);
    this.toddService.listTodos(this.conditions)
      .subscribe((data) => {
        this.todos = data;
        this.loader = false;
      });
  }

  getConditions(type: string): TodoConditions {
    if (type === this.TODOTYPES.today) {
      return {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          type: 'today'
        }
      };
    } else if (type === this.TODOTYPES.completed) {
      return {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          isCompleted: true
        }
      };
    } else if (type === this.TODOTYPES.pending) {
      return {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          type: 'pending'
        }
      };
    } else {
      return {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          type: 'backlog'
        }
      };
    }
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
      this.isRefreshPendingList = false;
    } else {
      this.isDelete = $event;
    }
  }

  updateTodo(todo: TodoType) {
    const postBody: TodoType = {
      _id: todo._id,
      isCompleted: true
    };
    this.isRefreshPendingList = true;
    this.toddService
      .updateTodo(postBody, this.conditions);
  }
}
