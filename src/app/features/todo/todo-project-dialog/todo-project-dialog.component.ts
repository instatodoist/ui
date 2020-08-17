import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { NgModule, Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoService, UtilityService } from '../../../service';
import { TodoType, TodoProjectType, TodoConditions, IOperationEnumType } from '../../../models';

@Component({
  selector: 'app-todo-project',
  templateUrl: './todo-project-dialog.component.html',
  styles: []
})
export class TodoProjectDialogComponent implements OnInit, AfterViewInit {

  @Input()
  todo: TodoType;
  @Input()
  conditions: TodoConditions = null;

  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  formObj: FormGroup;
  labels: TodoProjectType[];
  // dialog: MDCDialog;
  operationType: IOperationEnumType = 'ADD';

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private toast: UtilityService
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group(
      {
        name: ['', [Validators.required]],
        _id: [''],
        operationType: [this.operationType]
      }
    );
    this.getLabels();
  }

  ngAfterViewInit() {}

  getLabels() {
    this.todoService
      .listTodoProjects()
      .subscribe(response => {
        this.labels = response;
      });
  }

  editLabel(label: TodoProjectType) {
    this.operationType = 'UPDATE';
    this.formObj.patchValue({
      _id: label._id,
      name: label.name,
      operationType: 'UPDATE'
    });
  }

  deleteLabel(label: TodoProjectType) {
    this.operationType = 'DELETE';
    this.todoOperationExec({
      _id: label._id,
      operationType: 'DELETE'
    });
  }

  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      this.todoOperationExec(postBody);
    }
  }

  todoOperationExec(postBody) {
    this.todoService
      .todoProjectOperation(postBody)
      .subscribe(() => {
        this.formObj.reset();
        switch (this.operationType) {
        case 'ADD':
          this.toast.toastrSuccess('List has been added');
          break;
        case 'UPDATE':
          this.toast.toastrSuccess('List has been updated');
          break;
        case 'DELETE':
          this.toast.toastrWarning('List has been deleted');
          break;
        }
        this.operationType = 'ADD';
      });
  }

}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    TodoProjectDialogComponent
  ]
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TodoProjectDialogModule{}