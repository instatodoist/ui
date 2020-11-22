import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, ViewContainerRef, TemplateRef, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { TodoService, UtilityService } from '../../../service';
import { TodoType, TodoLabelType, TodoConditions, IOperationEnumType, TodoProjectType } from '../../../models';
import { } from '../../../gql';
import {  SharedModule } from '../../shared/shared.module';
import { DialogTodoTagsComponent } from '../todo-tag-dialog/dialog-todo-tags.component';
import { TodoProjectListDialogComponent } from '../todo-project-list-dialog/todo-projects-dialog.component';

/**
 * Date Types Options
 * on choosing Date
 */
type TScheduledString = 'NO_DUE_DATE' | 'TODAY' | 'TOMORROW' | 'NEXT_WEEK' | 'CUSTOM';

/**
 * Scheduled Object Values
 */
interface Ischeduled {
  name: string;
  value: string;
  slug: string;
}

/**
 * Hash map for date types
 * for popups
 */
type TscheduledObj = { [ key in TScheduledString ]: Ischeduled };

/**
 * Task Form Interface
 */
interface ITodoFormModel extends TodoType {
  scheduledType?: TScheduledString;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit, OnDestroy {
  @ViewChild('vctodo', { read: ViewContainerRef }) private vctodoRef: ViewContainerRef;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('tags', { read: TemplateRef }) private tagsRef: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('projectRef', { read: TemplateRef }) private projectsRef: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('date', { read: TemplateRef }) private dateRef: TemplateRef<any>;
  @ViewChild('titleInput') private elementRef: ElementRef;
  @Input() modelId = 'todo-dialog';
  @Input() todo: TodoType = null; // todo object if update
  @Input() conditions: TodoConditions = null; // conditions object
  private routeSubscription: Subscription;
  nestedModalId = '';
  title = 'Add Task'; // default title if use same component for ADD/EDIT
  operationType: IOperationEnumType = 'ADD'; // default operationType if use same component for ADD/EDIT
  todoCurrentType: string; // current route
  currentProject = ''; // Default List name
  labelIdVal: string[] = []; // Tags Array
  isSubmit = false; // submit button flag
  today = moment(new Date()).startOf('day');
  labels: TodoLabelType[]; // labels array
  projects: TodoProjectType[] = [];
  formObj: FormGroup;
  scheduledObj = this.initscheduledObj();
  scheduledObjKeys = Object.keys(this.scheduledObj);
  subTasksFormArray: FormArray;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private todoService: TodoService,
    private toastr: UtilityService
  ) { }

  /**
   * Lifecycle Method
   */
  ngOnInit(): void {
    this.formObj = this.createForm({
      _id: '',
      title: '',
      scheduling: false,
      scheduledDate: new Date(this.scheduledObj.TODAY.value),
      labelIds: [],
      projectId: '',
      operationType: 'ADD',
      isCompleted: false,
      scheduledType: 'TODAY',
      subTasks: this.createFormArray()
    });
    this.populateTodoModal(); // Listen to subscription to choose if popup called
    this.fetchData();
  }

  get formValue(): ITodoFormModel {
    return this.formObj.value as ITodoFormModel;
  }

  /**
   * Create type safe form group object
   */
  private createForm(model: ITodoFormModel): FormGroup {
    return this.fb.group(model);
  }

  /**
   * Create type safe form group object
   */
  private createFormArray()  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fb.array([ this.initSubTasks() ]) as any;
  }

  /**
   * Initiate subTask form group
   */
  private initSubTasks() {
    return this.createForm({
      title: '',
      isCompleted: false
    });
  }

  /**
   * Add subask onject
   */
  addSubTask(): void {
    const subTasksEmpty = this.formObj.value.subTasks.filter((item: TodoType) => !item.isCompleted && !item.title);
    if (subTasksEmpty.length < 2) {
      this.subTasksFormArray = this.formObj.get('subTasks') as FormArray;
      this.subTasksFormArray.push(this.initSubTasks());
    }
  }

  /**
   * Remove subtask
   *
   * @param itemIndex - index for subtask object
   */
  removeSubTask(itemIndex: number): void {
    this.subTasksFormArray = this.formObj.get('subTasks') as FormArray;
    if (itemIndex > -1) {
      this.subTasksFormArray.removeAt(itemIndex);
    }
  }

  /**
   * Get all subtasks as form array
   */
  get subTasks(): FormArray {
    return this.formObj.get('subTasks') as FormArray;
  }

  /**
   * Creating scheduled hashmap
   * for date option
   */
  private initscheduledObj(): TscheduledObj {
    return {
      NO_DUE_DATE: {
        name: 'No Due Date',
        slug: 'NO_DUE_DATE',
        value: null
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
        value: null
      }
    };
  }

  /**
   * load initial Data
   */
  private fetchData() {
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

  /**
   * On UPDATE: populate form
   */
  private populateTodoModal() {
    if(this.todo) {
      this.title = 'Update Task';
      this.labelIdVal = this.todo && this.todo.labels ? (this.todo.labels.map(label => label._id)) : [];
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
      if (this.todo?.subTasks?.length) {
        const subTasksControl = this.subTasks;
        (this.formObj.get('subTasks') as FormArray).clear();
        // Sort subtasks by title
        const subTasks = this.todo.subTasks
          .sort((a, b) => a.title.localeCompare(b.title));
        subTasks.forEach((element: TodoType) => {
          subTasksControl.push(this.fb.group(element));
        });
        this.addSubTask();
      }
    }
  }

  /**
   * auto checked the labels if exist
   *
   * @param label - label Object
   */
  isChecked(label: TodoLabelType): boolean {
    return this.formObj.value.labelIds && this.formObj.value.labelIds.indexOf(label._id) !== -1 ? true : false;
  }

  /**
   * check & uncheck labels
   *
   * @param label - label object
   */
  checkLabels(label: TodoLabelType): void {
    const labelId = label._id;
    const index = this.formObj.value.labelIds.indexOf(labelId);
    if (index === -1) {
      this.formObj.value.labelIds.push(labelId);
    } else {
      this.formObj.value.labelIds.splice(index, 1);
    }
  }

  /**
   * get labels from child component vai Output
   *
   * @param data - labels/Tags Arrray
   */
  callbackLabel(data: string[]): void {
    this.formObj.patchValue({
      labelIds: data
    });
  }

  /**
   * Check scheduledDate
   *
   * @param scheduledDate - Date
   */
  scheduleTypeOnUpdate(scheduledDate: Date): string {
    if (scheduledDate) {
      if (moment(scheduledDate).isSame(moment(), 'day')) {
        return 'TODAY';
      }
      return 'CUSTOM';
    }
    return 'NO_DUE_DATE';
  }

  /**
   * Set the scheduled Date
   *
   * @param scheduledType - scheduledType
   */
  askDatePickerToOpen(scheduledType: TScheduledString): void {
    if (scheduledType === 'CUSTOM') {
      this.openListPopup('scheduledModal', 'DATE');
      this.formObj.patchValue({
        scheduledType
      });
    } else {
      this.formObj.patchValue({
        scheduledType,
        scheduledDate: this.scheduledObj[scheduledType].value
      });
    }
  }

  /**
   * open nested popups for project, tag & date
   *
   * @param nestedModalId - modelId
   * @param type - model type - PROJECT, TAG, DATE
   */
  openListPopup(nestedModalId: string, type: string = null): void {
    if(type === 'PROJECT') {
      this.insertTemplateRef(this.projectsRef);
    } else if(type === 'TAG') {
      this.insertTemplateRef(this.tagsRef);
    }  else if(type === 'DATE') {
      this.insertTemplateRef(this.dateRef);
    }
    setTimeout(() => {
      this.nestedModalId = nestedModalId;
      $(`#${nestedModalId}`).modal('toggle'); // Open & close Popup
      $(`#${this.modelId}`).css({ 'z-index': 1040 });
      $(`#${nestedModalId}`).on('hidden.bs.modal', () => { // listen modal close event
        $(`#${this.modelId}`).css({ 'z-index': 9999 });
        this.vctodoRef.clear();
      });
    }, 0);

  }

  /**
   * get projectId from child component vai Output
   *
   * @param data - projectId
   */
  callbackProject(data: string): void {
    const projectName = this.projects.filter(obj => (obj._id) === data)[0].name;
    this.currentProject = projectName;
    this.formObj.patchValue({
      projectId: data
    });
    $('#' + this.nestedModalId).modal('toggle');
  }

  /**
   * get date from child component vai Output
   *
   * @param data - Date
   */
  callbackDate(data: string): void {
    this.formObj.patchValue({
      scheduledDate: data
    });
    $(`#${this.nestedModalId}`).modal('toggle');
  }

  /**
   * add/update the task
   */
  submit(): void {
    if (this.formObj.valid) {
      const postBody = this.formValue;
      const { subTasks } = postBody;
      let filteredSubTasks = subTasks.filter((item: TodoType) => item.title);
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

  /**
   * Insert TemplateRef into View Conatiner
   *
   * @param ref - TemplateRef
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insertTemplateRef(ref: TemplateRef<any>): void {
    this.vctodoRef.insert(ref.createEmbeddedView(null));
  }

  /**
   * Lifecycle Method
   */
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.vctodoRef.clear();
  }

}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations:[
    TodoDialogComponent,
    DialogTodoTagsComponent,
    TodoProjectListDialogComponent
  ]
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TodoDialogModule{}
