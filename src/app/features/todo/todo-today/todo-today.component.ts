import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TodoListType } from '../../../models/todo.model';
import {  TodoConditions } from '../../../models/todo.model';
import { SharedService} from '../../../service/shared/shared.service';
import { TodoService } from '../../../service/todo/todo.service';

@Component({
  selector: 'app-todo-today',
  templateUrl: './todo-today.component.html',
  styleUrls: ['./todo-today.component.scss'],
})
export class TodoTodayComponent implements OnInit {
  loader = false;
  todosToday: TodoListType;

  constructor(private toddService: TodoService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loader = true;
    const conditions: TodoConditions = {
      sort: {
        updatedAt: 'DESC'
      },
      filter: {
        isCompleted: false,
        startAt: this.sharedService.todayDate()
      }
    };
    this.toddService.listTodos(conditions)
      .subscribe((data) => {
        this.todosToday = data;
        this.loader = false;
    });
  }

}
