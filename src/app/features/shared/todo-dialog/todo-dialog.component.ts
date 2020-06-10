import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoService, SharedService, AppService, UtilityService } from '../../../service';
import { TodoType, TodoLabelType, TodoConditions, OperationEnumType } from '../../../models';
import { map } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { } from '../../../gql';
import * as moment from 'moment';
declare var $: any;
declare var flatpickr: any;

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('titleInput') private elementRef: ElementRef;
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
  // TODOTYPES: any; // todo types wrt routes
  todoCurrentType: string; // current route
  operationType: OperationEnumType = 'ADD';
  currentLabel = '';
  labelIdVal: string[] = [];
  isSubmit = false;
  popUpType = 'TODO_ADD';
  TODOTYPES = this.todoService.todoTypes();
  private modalSubscription: Subscription;
  private routeSubscription: Subscription;
  today = moment(new Date()).startOf('day');

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private todoService: TodoService,
    private sharedService: SharedService,
    private appService: AppService,
    private toastr: UtilityService
  ) { }

  ngOnInit(): void {
    this.priorities = this.todoService.getPriorities;
    this.formObj = this.fb.group({
      _id: [''],
      title: ['', [Validators.required]],
      scheduling: [false],
      scheduledDate: [this.sharedService.todayDate()],
      labelId: [[]],
      projectId: [''],
      priority: ['P4'],
      operationType: [this.operationType],
      isCompleted: [false]
    });
    this.subscribeToModal();
    this.TODOTYPES = this.todoService.todoTypes(); // getting route types
    this.routeSubscription = combineLatest([
      this.todoService.listTodoProjects()
    ])
      .pipe(
        map(data => ({
          // params: data[0],
          labels: data[0]
        }))
      )
      .subscribe(data => {
        const url = this.router.url;
        let label = null;
        if (url.match('lists')) {
          const splitArr = url.split('/');
          label = splitArr[splitArr.length - 1] || null;
        }
        const { labels = [] } = data;
        this.labels = labels;
        if (!label) {
          this.todoCurrentType = this.todoService.getCurentRoute();
          this.conditions = this.todoService.getConditions(this.todoCurrentType);
        } else {
          const labelId = labels.filter(obj => (obj.name).toLowerCase() === label.toLowerCase())[0]._id;
          // this.formObj.value.labelId.push(labelId);
          this.formObj.value.projectId = labelId;
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
    // Set autofocus
    this.elementRef.nativeElement.focus();
    if (typeof flatpickr !== 'undefined' && $.isFunction(flatpickr)) {
      const config: any = {
        // inline: true,
        dateFormat: 'Y-m-d'
      };
      if (!this.todo) {
        config.minDate = new Date();
      }
      $('.flatpicker').flatpickr(config);
    }
    $('#' + this.modelId).modal('toggle');
    const externalModal = this.appService.externalModal;
    const defaultConfig = this.appService.ExternalModelConfig;
    // tslint:disable-next-line: only-arrow-functions
    $(`#${this.modelId}`).on('hidden.bs.modal', function () {
      externalModal.next({
        ...defaultConfig,
        [this.popUpType]: false
      });
    });
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  // set priority
  setPriority(priority: any) {
    this.formObj.patchValue({
      priority: priority.name
    });
    this.priorityColor = priority.color;
  }

  // auto checked the labels if exist
  isChecked(labelId: string) {
    return this.formObj.value.projectId.indexOf(labelId) !== -1 ? true : false;
  }

  // check & uncheck labels
  checkLabels($event, label: any) {
    this.currentLabel = label.name;
    const labelId = label._id;
    // this.formObj.value.labelId = [labelId];
    this.formObj.value.projectId = labelId;
  }

  isScheduling() {
    this.formObj.patchValue({
      scheduling: !this.formObj.value.scheduling
    });
  }

  // add/update the task
  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      let refetch: TodoConditions;
      if (
        postBody.scheduling &&
        postBody.scheduledDate
      ) {
        const scheduledDate = moment(postBody.scheduledDate).startOf('day');
        if (
          this.todoCurrentType !== this.TODOTYPES.upcoming &&
          (scheduledDate.isAfter(this.today))
        ) {
          refetch = this.todoService.getConditions(this.TODOTYPES.upcoming);
        }
        if (
          this.todoCurrentType !== this.TODOTYPES.today &&
          (scheduledDate.isSame(this.today))
        ) {
          refetch = this.todoService.getConditions(this.TODOTYPES.today);
        }
      } else {
        refetch = this.todoService.getConditions(this.TODOTYPES.inbox);
      }
      if (
        this.todoCurrentType !== this.TODOTYPES.completed && postBody.isCompleted
      ) {
        refetch = this.todoService.getConditions(this.TODOTYPES.completed);
      }
      this.isSubmit = true;
      this.todoService
        .todoOperation(postBody, this.conditions, refetch)
        .subscribe(() => {
          this.isSubmit = false;
          this.isOpen.emit(false);
          $(`#${this.modelId}`).modal('hide');
          let message = 'Task created';
          if (this.formObj.value._id) {
            message = 'Task updated';
          }
          this.toastr.toastrSuccess(message);
        },
          () => {
            this.isSubmit = false;
          }
        );
    }
  }

  private subscribeToModal() {
    this.modalSubscription = this.appService.externalModal.subscribe(data => {
      if (data.data.todo) {
        this.title = 'Update Task';
        this.labelIdVal = this.todo ? (this.todo.labels.map(label => {
          return label._id;
        })) : [];
        this.popUpType = 'TODO_UPDATE';
        this.todo = data.data.todo;
        this.formObj.patchValue({
          _id: this.todo && this.todo._id || '',
          title: this.todo && this.todo.title,
          scheduling: this.todo && this.todo.scheduledDate ? true : false,
          scheduledDate: this.todo && this.todo.scheduledDate ? this.todo.scheduledDate : this.sharedService.todayDate(),
          labelId: this.labelIdVal,
          operationType: 'UPDATE',
          priority: this.todo.priority || 'P4',
          isCompleted: this.todo && this.todo.isCompleted ? true : false
        });
        this.priorityColor = this.todoService.getColor(this.formObj.value.priority);
      }
    });
  }
}
