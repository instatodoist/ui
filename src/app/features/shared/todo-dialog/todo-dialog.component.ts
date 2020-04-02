import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDCDialog } from '@material/dialog';
import {MDCSwitch} from '@material/switch';
import {MDCMenu} from '@material/menu';
import { TodoService } from '../../../service/todo/todo.service';
import { SharedService } from '../../../service/shared/shared.service';
import { TodoType, TodoLabelType, TodoConditions, OperationEnumType } from '../../../models/todo.model';


@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit, AfterViewInit {

  @Input()
  todo: TodoType = null; // todo object if update
  @Input()
  conditions: TodoConditions = null; // conditions object
  @Input()
  origin = null;
  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>(); // open flag
  menu: MDCMenu; // mdc instance for label
  menuPriority: MDCMenu; // mdc instance for priority
  title = 'Add Task';
  formObj: FormGroup;
  labels: TodoLabelType[]; // labels array
  dialog: MDCDialog; // dialog instance
  priorityColor = 'black'; // default color for priority
  priorities = [];
  TODOTYPES: any; // todo types wrt routes
  todoCurrentType: string; // current route
  operationType: OperationEnumType = 'ADD';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private todoService: TodoService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.priorities = this.todoService.getPriorities();
    // checking labels if update
    const labelIdVal = this.todo ? (this.todo.label.map(label  => {
      return label._id;
    })) : [];
    // creating form
    this.formObj = this.fb.group({
        _id: [this.todo && this.todo._id || ''],
        title: [this.todo && this.todo.title, [Validators.required]],
        scheduling: [this.todo && this.todo.scheduledDate ? true : false],
        scheduledDate: [this.todo && this.todo.scheduledDate ? this.todo.scheduledDate : this.sharedService.todayDate()],
        labelId: [labelIdVal],
        priority: ['P4'],
        operationType: [this.operationType]
      }
    );
    // setting title
    if (this.todo) {
      this.title = 'Update Task';
      this.formObj.patchValue({
        _id: this.todo._id,
        priority: this.todo.priority,
        operationType: 'UPDATE'
      });
      this.priorityColor = this.todoService.getColor(this.formObj.value.priority);
    }
    this.menu = new MDCMenu(document.querySelector('.mdc-menu-labels'));
    this.menuPriority = new MDCMenu(document.querySelector('.mdc-menu-priority'));
    this.TODOTYPES = this.todoService.todoTypes(); // getting route types
    this.getLabels(); // getting labels
    this.checkingRouteTypes(); // checking route types wrt current route
  }

  ngAfterViewInit() {
    this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
    const switchControl = new MDCSwitch(document.querySelector('.mdc-switch'));
    this.dialog.open();
    this.dialog.listen('MDCDialog:closing', () =>  {
      this.isOpen.emit(false);
    });
  }

  /**
   * @description - use to check conditions wrt current route
   */
  checkingRouteTypes() {
    if (this.router.url === '/tasks/today') { // checking route if today
      this.todoCurrentType = this.TODOTYPES.today;
      this.formObj.patchValue({
        scheduling: true
      });
    } else if (this.router.url === '/tasks/completed') { // checking route if completed
      this.todoCurrentType = this.TODOTYPES.completed;
    } else if (this.router.url === '/tasks/inbox') { // checking route if inbox
      this.todoCurrentType = this.TODOTYPES.inbox;
    } else if (this.router.url === '/tasks/pending') { // checking route if inbox
      this.todoCurrentType = this.TODOTYPES.pending;
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

  // open priority menu
  openPriority() {
    this.menuPriority.open = true;
  }

  // set priority
  setPriority(priority: any) {
    this.formObj.patchValue({
      priority: priority.name
    });
    this.priorityColor = priority.color;
  }

  // open labels menu
  openLabels() {
    this.menu.open = true;
  }

  // auto checked the labels if exist
  isChecked(labelId: string) {
    return this.formObj.value.labelId.indexOf(labelId) !== -1 ? true : false;
  }

  // check & uncheck labels
  checkLabels($event, labelId: string) {
    const index = this.formObj.value.labelId.indexOf(labelId);
    if (index === -1) {
      this.formObj.value.labelId.push(labelId);
    } else {
      this.formObj.value.labelId.splice(index, 1);
    }
  }

  // fetching labels
  getLabels() {
    this.todoService
      .listTodoLabels()
      .subscribe(response => {
        this.labels = response;
      });
  }

  // add/update the task
  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      this.todoService
        .todoOperation(postBody, this.conditions)
        .subscribe(() => {
          this.dialog.close();
          this.formObj.reset();
        });
    }
  }
}
