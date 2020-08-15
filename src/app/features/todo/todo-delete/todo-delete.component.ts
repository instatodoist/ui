import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../../service/todo/todo.service';
import { TodoType, TodoConditions } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-delete',
  templateUrl: './todo-delete.component.html',
  styleUrls: ['./todo-delete.component.scss']
})
export class TodoDeleteComponent implements OnInit {

  @Input()
  todo: TodoType;
  @Input()
  conditions: TodoConditions = null;

  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
  }

}
