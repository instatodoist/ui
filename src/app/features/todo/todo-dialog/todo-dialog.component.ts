import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../../service/todo/todo.service';
import { TodoType } from '../../../models/todo.model';
import { MDCDialog } from '@material/dialog';
@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit, AfterViewInit {

  @Input()
  todo: TodoType;

  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.todo._id) {
      console.log(this.todo)
      const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
      dialog.open();
      // dialog.listen('MDCDialog:opened', () => {
      //   // Assuming contentElement references a common parent element with the rest of the page's content
      //   // contentElement.setAttribute('aria-hidden', 'true');
      // });
      dialog.listen('MDCDialog:closing', () =>  {
        this.isOpen.emit(false);
      });
    }
  }

}
