import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDCDialog } from '@material/dialog';
import { TodoService } from '../../../service/todo/todo.service';
import { SharedService } from '../../../service/shared/shared.service';
import { TodoType, TodoLabelType, TodoConditions } from '../../../models/todo.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.scss']
})
export class TodoAddComponent implements OnInit, AfterViewInit {

  @Input()
  todo: TodoType; // getting todo object from parent
  @Input()
  conditions: TodoConditions = null; // getting todo conditions from parent if exist

  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>(); // popup flag

  formObj: FormGroup;
  labels: TodoLabelType[];
  dialog: MDCDialog;
  TODOTYPES: any; // todo types wrt routes
  todoCurrentType: string; // current route

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
        title: ['', [Validators.required]],
        scheduledDate: [this.sharedService.todayDate()],
        labelId: [[]]
      }
    );
    this.TODOTYPES = this.todoService.todoTypes(); // getting route types
    this.getLabels(); // getting labels
    this.checkingRouteTypes(); // checking route types wrt current route
  }

  ngAfterViewInit() {
    this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
    this.dialog.open();
    this.dialog.listen('MDCDialog:closing', () => {
      this.isOpen.emit(false);
    });
  }

  /**
   * @description - use to check conditions wrt current route
   */
  checkingRouteTypes() {
    if (this.router.url === '/tasks/today') { // checking route if today
      this.todoCurrentType = this.TODOTYPES.today;
    } else if (this.router.url === '/tasks/completed') { // checking route if completed
      this.todoCurrentType = this.TODOTYPES.completed;
    } else if (this.router.url === '/tasks/inbox') { // checking route if inbox
      this.todoCurrentType = this.TODOTYPES.inbox;
    }
    if (this.router.url.match('tasks/labels')) { // special case for labelled type
      const routerStrArr = this.router.url.split('/');
      const labelId = routerStrArr[routerStrArr.length - 2];
      this.todoCurrentType = labelId;
      this.conditions = this.todoService.getConditions(this.todoCurrentType);
      // populating label wrt route label
      if (this.todoCurrentType) {
        this.formObj.value.labelId.push(labelId);
      }
    } else {
      this.conditions = this.todoService.getConditions(this.todoCurrentType); // default case for all types except labelled
    }
  }

  /**
   * @param labelId - labelId
   * @description - Use to checked the existing labels
   */
  isChecked(labelId: string) {
    return (this.formObj.value.labelId.indexOf(labelId) !== -1) ? true : false;
  }

  /**
   * @description - calling todo service for fetching labels
   */
  getLabels() {
    this.todoService
      .listTodoLabels()
      .subscribe(response => {
        this.labels = response;
      });
  }

  /**
   * @description - Adding new task
   */
  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      this.todoService
        .addTodo(postBody, this.conditions)
        .subscribe(() => {
          this.dialog.close();
        });
    }
  }

}
