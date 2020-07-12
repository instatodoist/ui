import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { TodoService, SharedService, AppService, UtilityService } from '../../../service';
import { TodoType, TodoLabelType, TodoConditions, OperationEnumType, TodoProjectType } from '../../../models';
import { map } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { } from '../../../gql';
import * as moment from 'moment';
declare var $: any;
type ScheduledType = 'NO_DUE_DATE' | 'TODAY' | 'TOMORROW' | 'NEXT_WEEK' | 'CUSTOM';
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
  nestedModalId = '';

  // @Output() isOpen: EventEmitter<boolean> = new EventEmitter<boolean>(); // open flag
  private modalSubscription: Subscription;
  private routeSubscription: Subscription;
  title = 'Add Task'; // default title if use same component for ADD/EDIT
  operationType: OperationEnumType = 'ADD'; // default operationType if use same component for ADD/EDIT
  popUpType = 'TODO_ADD';
  todoCurrentType: string; // current route
  currentProject = ''; // Default List name
  labelIdVal: string[] = []; // Tags Array
  isSubmit = false; // submit button flag
  TODOTYPES = this.todoService.todoTypes(); // Types of ToDOS
  today = moment(new Date()).startOf('day');
  labels: TodoLabelType[]; // labels array
  projects: TodoProjectType[] = [];
  flatPickerConfig: any;
  formObj: FormGroup;
  scheduledObj = {
    NO_DUE_DATE: {
      name: 'No Due Date',
      slug: 'NO_DUE_DATE',
      value: ''
    },
    TODAY: {
      name: 'Later Today',
      slug: 'TODAY',
      value: moment().format('YYYY-MM-DD')
    },
    TOMORROW: {
      name: 'Tomorrow',
      slug: 'TOMORROW',
      value: moment().add(1, 'days').format('YYYY-MM-DD')
    },
    NEXT_WEEK: {
      name: 'Next week',
      slug: 'NEXT_WEEK',
      value: moment().add(7, 'days').format('YYYY-MM-DD')
    },
    CUSTOM: {
      name: 'Custom',
      slug: 'CUSTOM',
      value: ''
    }
  };
  scheduledObjKeys = Object.keys(this.scheduledObj);
  subTasksFormArray: FormArray;

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
      scheduledDate: [this.scheduledObj.TODAY.value], // scheduled Date
      labelIds: [[]], // Tags Array
      projectId: [''], // List ID
      operationType: [(this.todo && this.todo._id) ? 'UPDATE' : 'ADD'], // ADD || UPDATE
      isCompleted: [false],
      scheduledType: ['TODAY'],
      subTasks: this.fb.array([this.initSubTasks()])
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
          let projectFilteredArr = null;
          if (this.formObj.value.projectId) {
            projectFilteredArr = projects.filter(obj => (obj._id) === this.formObj.value.projectId);
          }
          // else {
          //   projectFilteredArr = projects.filter(obj => (obj.name).toLowerCase() === this.currentProject.toLowerCase());
          // }
          if (projectFilteredArr && projectFilteredArr.length) {
            this.formObj.patchValue({
              projectId: projectFilteredArr[0]._id
            });
            this.currentProject = projectFilteredArr[0].name;
          }
          this.todoCurrentType = this.todoService.getCurentRoute();
          this.conditions = this.todoService.getConditions(this.todoCurrentType);
        } else {
          const projectId = projects.filter(obj => (obj.name).toLowerCase() === project.toLowerCase())[0]._id;
          this.formObj.patchValue({
            projectId
          });
          this.conditions = this.todoService.getConditions(projectId, 'labels');
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
  }

  ngAfterViewInit() {
    $('#' + this.modelId).modal('toggle'); // Open & close Popup
    // tslint:disable-next-line: only-arrow-functions
    $(`#${this.modelId}`).on('hidden.bs.modal', () => { // listen modal close event
      this.externalModal.next({
        ...this.defaultConfig,
        [this.popUpType]: false,
        data: {
          ...this.defaultConfig.data, todo: null
        }
      });
    });
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  private initSubTasks(): FormGroup {
    return this.fb.group({
      title: '',
      isCompleted: false
    });
  }

  addSubTask(): void {
    const subTasksEmpty = this.formObj.value.subTasks.filter((item: TodoType) => {
      return !item.isCompleted && !item.title;
    });
    if (subTasksEmpty.length < 2) {
      this.subTasksFormArray = this.formObj.get('subTasks') as FormArray;
      this.subTasksFormArray.push(this.initSubTasks());
    }
  }

  removeSubTask(itemIndex: number): void {
    this.subTasksFormArray = this.formObj.get('subTasks') as FormArray;
    if (itemIndex > -1) {
      this.subTasksFormArray.removeAt(itemIndex);
    }
  }

  // auto checked the labels if exist
  isChecked(label: TodoLabelType) {
    return this.formObj.value.labelIds.indexOf(label._id) !== -1 ? true : false;
  }

  // check & uncheck labels
  checkLabels(label: TodoLabelType) {
    const labelId = label._id;
    const index = this.formObj.value.labelIds.indexOf(labelId);
    if (index === -1) {
      this.formObj.value.labelIds.push(labelId);
    } else {
      this.formObj.value.labelIds.splice(index, 1);
    }
  }

  get subTasks(): FormArray {
    return this.formObj.get('subTasks') as FormArray;
  }

  scheduleTypeOnUpdate(scheduledDate: any) {
    if (scheduledDate) {
      if (moment(scheduledDate).isSame(moment(), 'day')) {
        return 'TODAY';
      }
      return 'CUSTOM';
    }
    return 'NO_DUE_DATE';
  }

  private subscribeToModal() {
    this.modalSubscription = this.appService.externalModal.subscribe(data => {
      if (data.data.todo) {
        this.todo = data.data.todo;
        this.title = 'Update Task';
        this.labelIdVal = this.todo && this.todo.labels ? (this.todo.labels.map(label => {
          return label._id;
        })) : [];
        this.popUpType = this.todo._id ? 'TODO_UPDATE' : 'TODO_ADD';
        this.formObj.patchValue({
          _id: this.todo && this.todo._id || '',
          title: this.todo && this.todo.title || '',
          projectId: this.todo && this.todo.projectId || '',
          scheduledDate: this.todo && this.todo.scheduledDate ? this.todo.scheduledDate : '',
          scheduledType: this.scheduleTypeOnUpdate(this.todo.scheduledDate),
          labelIds: this.labelIdVal,
          operationType: this.todo._id ? 'UPDATE' : 'ADD',
          isCompleted: this.todo && this.todo.isCompleted ? true : false
        });
        if (this.todo.subTasks.length) {
          const subTasksControl = this.subTasks;
          (this.formObj.get('subTasks') as FormArray).clear();
          console.log(this.todo.subTasks);
          // Sort subtasks by title
          const subTasks = this.todo.subTasks
            .sort((a, b) => a.title.localeCompare(b.title));
          subTasks.forEach((element: TodoType) => {
            subTasksControl.push(this.fb.group(element));
          });
          this.addSubTask();
        }
      } else {
        this.popUpType = 'TODO_ADD';
      }
    });
  }

  askDatePickerToOpen(scheduledType: ScheduledType) {
    if (scheduledType === 'CUSTOM') {
      this.openListPopup('scheduledModal');
      this.formObj.patchValue({
        scheduledType,
      });
    } else {
      this.formObj.patchValue({
        scheduledType,
        scheduledDate: this.scheduledObj[scheduledType].value
      });
    }
  }

  openListPopup(nestedModalId: string) {
    this.nestedModalId = nestedModalId;
    $(`#${nestedModalId}`).modal('toggle'); // Open & close Popup
    $(`#${this.modelId}`).css({ 'z-index': 1040 });
    $(`#${nestedModalId}`).on('hidden.bs.modal', () => { // listen modal close event
      $(`#${this.modelId}`).css({ 'z-index': 9999 });
    });
  }

  recieveDataAsLabels(data: string[]) {
    this.formObj.patchValue({
      labelIds: data
    });
  }

  recieveDataAsProjectId(data: string) {
    const projectName = this.projects.filter(obj => (obj._id) === data)[0].name;
    this.currentProject = projectName;
    this.formObj.patchValue({
      projectId: data
    });
    $('#' + this.nestedModalId).modal('toggle');
  }

  recieveDataAsDate(data: string) {
    this.formObj.patchValue({
      scheduledDate: data
    });
    $(`#${this.nestedModalId}`).modal('toggle');
  }

  // add/update the task
  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      const { subTasks } = postBody;
      let filteredSubTasks = subTasks.filter((item: TodoType) => {
        return item.title;
      });
      filteredSubTasks = filteredSubTasks.map((item: TodoType) => {
        const { isCompleted, title } = item;
        return {
          isCompleted,
          title
        };
      });
      if (postBody._id) {
        postBody.subTasks = filteredSubTasks;
      } else {
        delete postBody.subTasks;
      }
      this.isSubmit = true;
      this.todoService
        .todoOperation(postBody, this.conditions)
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
