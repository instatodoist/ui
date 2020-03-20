import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDCDialog } from '@material/dialog';
import {MDCSwitch} from '@material/switch';
import { TodoService } from '../../../service/todo/todo.service';
import { TodoType, TodoLabelType } from '../../../models/todo.model';

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

  formObj: FormGroup;
  labels: TodoLabelType[];
  dialog: MDCDialog;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    const labelIdVal = this.todo.label._id ? this.todo.label._id : '';
    this.formObj = this.fb.group(
      {
        _id: [this.todo._id],
        title: [this.todo.title, [Validators.required]],
        noDate: [this.todo.scheduledDate ? true : false],
        scheduledDate: [this.todo.scheduledDate ? this.todo.scheduledDate : this.todayDate()],
        labelId: [labelIdVal]
      }
    );
    this.getLabels();
  }

  ngAfterViewInit() {
    if (this.todo._id) {
      console.log(this.todo);
      this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
      const switchControl = new MDCSwitch(document.querySelector('.mdc-switch'));
      this.dialog.open();
      // dialog.listen('MDCDialog:opened', () => {
      //   // Assuming contentElement references a common parent element with the rest of the page's content
      //   // contentElement.setAttribute('aria-hidden', 'true');
      // });
      this.dialog.listen('MDCDialog:closing', () =>  {
        this.isOpen.emit(false);
      });
    }
  }

  todayDate() {
    const today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }

    if (mm < 10) {
      mm = `0${mm}`;
    }
    return `${yyyy}-${mm}-${dd}`;
  }

  getLabels() {
    this.todoService
      .listTodoLabels()
      .subscribe(response => {
        this.labels = response;
      });
  }

  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      this.todoService
        .updateTodo(postBody)
        .subscribe(response => {
          console.log(response);
          this.dialog.close();
        });
    }
  }
}
