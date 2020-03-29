import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MDCDialog } from '@material/dialog';
import { TodoService } from '../../../service/todo/todo.service';
import { TodoType, TodoLabelType, TodoConditions } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.scss']
})
export class TodoAddComponent implements OnInit, AfterViewInit {

  @Input()
  todo: TodoType;
  @Input()
  conditions: TodoConditions = null;

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
    this.formObj = this.fb.group(
      {
        title: ['', [Validators.required]],
        scheduledDate: [null],
        labelId: [[]]
      }
    );
    this.getLabels();
  }

  isChecked(labelId: string) {
    return (this.formObj.value.labelId.indexOf(labelId) !== -1) ? true : false;
  }

  // onRemoveSpecialRequest(index) {
  //   this.formObj.controls.labelId.removeAt(index);
  // }

  ngAfterViewInit() {
    this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
    this.dialog.open();
    this.dialog.listen('MDCDialog:closing', () => {
      this.isOpen.emit(false);
    });
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
        .addTodo(postBody)
        .subscribe(() => {
          this.dialog.close();
        });
    }
  }

}
