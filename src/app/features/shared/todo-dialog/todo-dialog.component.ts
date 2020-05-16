import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoService, SharedService, AppService } from '../../../service';
import { TodoType, TodoLabelType, TodoConditions, OperationEnumType } from '../../../models';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
declare var $: any;
declare var flatpickr: any;

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit, AfterViewInit {

  @Input()
  modelId = 'todo-dialog';
  @Input()
  todo: TodoType = null; // todo object if update
  @Input()
  conditions: TodoConditions = null; // conditions object
  @Input()
  origin = null;
  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>(); // open flag
  title = 'Add Task';
  formObj: FormGroup;
  labels: TodoLabelType[]; // labels array
  priorityColor = this.todoService.getPriorities[3].color; // default color for priority
  priorities = [];
  TODOTYPES: any; // todo types wrt routes
  todoCurrentType: string; // current route
  operationType: OperationEnumType = 'ADD';
  currentLabel = '';
  labelIdVal: string[] = [];
  isSubmit = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private todoService: TodoService,
    private sharedService: SharedService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.priorities = this.todoService.getPriorities;
    // checking labels if update
    this.labelIdVal = this.todo ? (this.todo.label.map(label => {
      return label._id;
    })) : [];
    // creating form
    this.formObj = this.fb.group({
      _id: [this.todo && this.todo._id || ''],
      title: [this.todo && this.todo.title, [Validators.required]],
      scheduling: [this.todo && this.todo.scheduledDate ? true : false],
      scheduledDate: [this.todo && this.todo.scheduledDate ? this.todo.scheduledDate : this.sharedService.todayDate()],
      labelId: [this.labelIdVal],
      priority: ['P4'],
      operationType: [this.operationType],
      isCompleted: [this.todo && this.todo.isCompleted ? true : false]
    });
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
    this.TODOTYPES = this.todoService.todoTypes(); // getting route types

    combineLatest([
      this.activatedRoute.params,
      this.todoService.listTodoLabels()
    ])
      .pipe(
        map(data => ({
          params: data[0],
          labels: data[1]
        }))
      )
      .subscribe(data => {
        const { params = null, labels = [] } = data;
        const { label = null } = params;
        this.labels = labels;
        if (!label) {
          this.todoCurrentType = this.todoService.getCurentRoute();
          this.conditions = this.todoService.getConditions(this.todoCurrentType);
        } else {
          const labelId = labels.filter(obj => obj.name === label)[0]._id;
          this.formObj.value.labelId.push(labelId);
          this.labelIdVal = this.formObj.value.labelId;
          this.todoCurrentType = label;
          this.conditions = this.todoService.getConditions(labelId);
        }
        // populate label if any
        const filterLabel: TodoLabelType[] = this.labels.filter(item => item._id === this.labelIdVal[0]);
        if (filterLabel.length) {
          this.currentLabel = filterLabel[0].name;
        }
        if (this.todoCurrentType === 'today') {
          this.formObj.patchValue({
            scheduling: true
          });
        }
      });
  }

  ngAfterViewInit() {
    if (typeof flatpickr !== 'undefined' && $.isFunction(flatpickr)) {
      const config: any = {
        // inline: true,
        dateFormat: 'Y-m-d'
      };
      if (!this.todo) {
        config.minDate = new Date();
      }
      // if (!!this.todo && this.todo.scheduledDate) {
      //   const todo = this.todo;
      //   config.defaultDate = new Date(todo.scheduledDate);
      //   config.enable = [
      //     // tslint:disable-next-line: only-arrow-functions
      //     function(date) {
      //       return date === new Date(todo.scheduledDate) || date >= new Date();
      //     }
      //   ];
      // }
      $('.flatpicker').flatpickr(config);
    }
    const externalModal = this.appService.externalModal;
    const defaultConfig = this.appService.ExternalModelConfig;
    const modelId = this.modelId;
    // tslint:disable-next-line: only-arrow-functions
    $(`#${this.modelId}`).on('hidden.bs.modal', function() {
      if (modelId === 'todo-dialog-add') {
        externalModal.next({
          ...defaultConfig,
          TODO_ADD: false
        });
      } else {
        externalModal.next({
          ...defaultConfig,
          TODO_UPDATE: false
        });
      }
    });
  }

  // open priority menu
  openPriority() {
    // this.menuPriority.open = true;
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
    // this.menu.open = true;
  }

  // auto checked the labels if exist
  isChecked(labelId: string) {
    return this.formObj.value.labelId.indexOf(labelId) !== -1 ? true : false;
  }

  // check & uncheck labels
  checkLabels($event, label: any) {
    this.currentLabel = label.name;
    const labelId = label._id;
    this.formObj.value.labelId = [labelId];
  }

  isScheduling() {
    this.formObj.patchValue({
      scheduling: !this.formObj.value.scheduling
    });
  }

  // add/update the task
  submit() {
    if (this.formObj.valid) {
      this.isSubmit = true;
      const postBody = this.formObj.value;
      this.todoService
        .todoOperation(postBody, this.conditions)
        .subscribe(() => {
          this.isSubmit = false;
          // this.dialog.close();
          this.isOpen.emit(false);
          $(`#${this.modelId}`).modal('hide');
        },
          () => {
            this.isSubmit = false;
          }
        );
    }
  }
}
