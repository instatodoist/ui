import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TodoListType } from '../../../models/todo.model';
import {  TodoConditions } from '../../../models/todo.model';
import { SharedService} from '../../../service/shared/shared.service';
import { TodoService } from '../../../service/todo/todo.service';
@Component({
  selector: 'app-todo-completed',
  templateUrl: './todo-completed.component.html',
  styleUrls: ['./todo-completed.component.scss']
})
export class TodoCompletedComponent implements OnInit {
  loader = false;
  todos: TodoListType;

  constructor(private toddService: TodoService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loader = true;
    const conditions: TodoConditions = {
      sort: {
        updatedAt: 'DESC'
      },
      filter: {
        isCompleted: true,
      }
    };
    this.toddService.listTodos(conditions)
      .subscribe((data) => {
        this.todos = data;
        console.log(this.todos);
        this.loader = false;
    });
  }

}
