import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TodoListType, TodoSortType, TodoType } from '../../../models/todo.model';
import {  TodoConditions } from '../../../models/todo.model';
import { TodoService } from '../../../service/todo/todo.service';
import { SharedService} from '../../../service/shared/shared.service';
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
  conditions: TodoConditions;
  TODOTYPES = [
    'INBOX',
    'COMPLETED',
    'TODAY',
    'PENDING'
  ];
  todoCurrentType = this.TODOTYPES[0];

  constructor(
    private toddService: TodoService,
    private sharedService: SharedService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loader = true;
    if (this.router.url === '/tasks/today') {
      this.todoCurrentType = this.TODOTYPES[2];
      this.conditions = {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          startAt: this.sharedService.todayDate(),
          isCompleted: false
        }
      };
    } else if (this.router.url === '/tasks/completed') {
      this.todoCurrentType = this.TODOTYPES[1];
      this.conditions = {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          isCompleted: true
        }
      };
    } else {
      this.conditions = {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          isCompleted: false,
          endAt: this.sharedService.yesterdayDate()
        }
      };
    }
    this.toddService.listTodos(this.conditions)
      .subscribe((data) => {
        this.todos = data;
        this.loader = false;
    });
  }

  openUpdatePopUp(todo: TodoType): void {
    this.isUpdate = true;
    this.todo = todo; // passing todo object to update dialog
  }

  updatePopupFlag($event: boolean): void {
    this.isUpdate = $event;
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
