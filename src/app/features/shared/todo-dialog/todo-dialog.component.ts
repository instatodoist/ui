import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoService, SharedService, AppService, UtilityService } from '../../../service';
import { TodoType, TodoLabelType, TodoConditions, OperationEnumType, TodoProjectType } from '../../../models';
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
  @Input() modelId = 'todo-dialog';
  @Input() todo: TodoType = null; // todo object if update
  @Input() conditions: TodoConditions = null; // conditions object
  @Input() origin = null;
  externalModal = this.appService.externalModal;
  defaultConfig = this.appService.ExternalModelConfig;

  // @Output() isOpen: EventEmitter<boolean> = new EventEmitter<boolean>(); // open flag
  private modalSubscription: Subscription;
  private routeSubscription: Subscription;
  title = 'Add Task'; // default title if use same component for ADD/EDIT
  operationType: OperationEnumType = 'ADD'; // default operationType if use same component for ADD/EDIT
  popUpType = 'TODO_ADD';
  todoCurrentType: string; // current route
  currentProject = 'Personal'; // Default List name
  labelIdVal: string[] = []; // Tags Array
  isSubmit = false; // submit button flag
  TODOTYPES = this.todoService.todoTypes(); // Types of ToDOS
  today = moment(new Date()).startOf('day');
  labels: TodoLabelType[]; // labels array
  projects: TodoProjectType[] = [];
  flatPickerConfig: any;
  formObj: FormGroup;

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
    this.formObj = this.fb.group({
      _id: [''],
      title: ['', [Validators.required]], // Title
      scheduling: [false], // if date is set
      scheduledDate: [this.sharedService.todayDate()], // scheduled Date
      labelIds: [[]], // Tags Array
      projectId: [''], // List ID
      operationType: [this.operationType], // ADD || UPDATE
      isCompleted: [false]
    });
    this.subscribeToModal(); // Listen to subscription to choose if popup called
    this.routeSubscription = combineLatest([ // fetching Tags & Projects/List in the system
      this.todoService.listTodoLabels(),
      this.todoService.listTodoProjects()
    ])
      .pipe(
        map(data => ({
          // params: data[0],
          labels: data[0],
          projects: data[1]
        }))
      )
      .subscribe(data => {
        const url = this.router.url;
        let project = null;
        if (url.match('lists')) {
          const splitArr = url.split('/');
          project = splitArr[splitArr.length - 1] || null;
        }
        const { labels = [], projects = [] } = data;
        this.labels = labels;
        this.projects = projects;
        if (!project) {
          this.todoCurrentType = this.todoService.getCurentRoute();
          this.conditions = this.todoService.getConditions(this.todoCurrentType);
        } else {
          const projectId = labels.filter(obj => (obj.name).toLowerCase() === project.toLowerCase())[0]._id;
          this.formObj.value.projectId = projectId;
          this.conditions = this.todoService.getConditions(projectId);
        }
        // populate project if any
        const filteredProject: TodoLabelType[] = this.projects.filter(item => item._id === this.formObj.value.projectId);
        if (filteredProject.length) {
          this.currentProject = filteredProject[0].name;
        }
        if (this.todoCurrentType === 'today') { // set scheduled date Today
          this.formObj.patchValue({
            scheduling: true
          });
        }
      });

    this.formObj.get('scheduledDate').valueChanges.subscribe((data) => {
      console.log(data)
    })
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.focus(); // Set autofocus for title
    if (typeof flatpickr !== 'undefined' && $.isFunction(flatpickr)) { // Initialise Date Picker
      this.flatPickerConfig = {
        // inline: true,
        dateFormat: 'Y-m-d'
      };
      if (!this.todo) {
        this.flatPickerConfig.minDate = new Date();
      }
      $('.flatpicker').flatpickr(this.flatPickerConfig);
    }
    $('#' + this.modelId).modal('toggle'); // Open & close Popup
    // tslint:disable-next-line: only-arrow-functions
    $(`#${this.modelId}`).on('hidden.bs.modal', () => { // listen modal close event
      this.externalModal.next({
        ...this.defaultConfig,
        [this.popUpType]: false
      });
    });
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  // auto checked the labels if exist
  isChecked(label: TodoLabelType) {
    return this.formObj.value.labelIds.indexOf(label._id) !== -1 ? true : false;
  }

  checkProject(project: TodoProjectType) {
    this.currentProject = project.name;
    this.formObj.patchValue({
      projectId: project._id
    });
  }

  // check & uncheck labels
  checkLabels($event, label: TodoLabelType) {
    const labelId = label._id;
    const index = this.formObj.value.labelIds.indexOf(labelId);
    if (index === -1) {
      this.formObj.value.labelIds.push(labelId);
    } else {
      this.formObj.value.labelIds.splice(index, 1);
    }
  }

  isScheduling() {
    this.formObj.patchValue({
      scheduling: !this.formObj.value.scheduling
    });
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
          projectId: this.todo && this.todo.projectId,
          scheduling: this.todo && this.todo.scheduledDate ? true : false,
          scheduledDate: this.todo && this.todo.scheduledDate ? this.todo.scheduledDate : this.sharedService.todayDate(),
          labelIds: this.labelIdVal,
          operationType: 'UPDATE',
          isCompleted: this.todo && this.todo.isCompleted ? true : false
        });
      }
    });
  }

  askDatePickerToOpen() {
    this.externalModal.next({
      ...this.defaultConfig,
      DATE_PICKER: true,
      data: {
        ...this.defaultConfig.data,
        todo: this.todo,
        formControlName: 'scheduledDate'
      }
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
          // this.isOpen.emit(false);
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
}
