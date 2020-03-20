import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MDCDialog } from '@material/dialog';
import { TodoService } from '../../../service/todo/todo.service';
import { TodoType, TodoConditions } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-delete',
  templateUrl: './todo-delete.component.html',
  styleUrls: ['./todo-delete.component.scss']
})
export class TodoDeleteComponent implements OnInit, AfterViewInit {

  @Input()
  todo: TodoType;
  @Input()
  conditions: TodoConditions = null;

  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  dialog: MDCDialog;

  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.todo._id) {
      console.log(this.todo);
      this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
      this.dialog.open();
      this.dialog.listen('MDCDialog:closing', () =>  {
        this.isOpen.emit(false);
      });
    }
  }

  submit() {
    this.todoService
        .deleteTodo(this.todo._id, this.conditions)
        .subscribe(() => {
          this.dialog.close();
        });
    }

}
