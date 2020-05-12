import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map } from 'rxjs/operators';
import { combineLatest, from, Subscription } from 'rxjs';
import { TodoListType, TodoCompletedListType, TodoType, TodoConditions, IExternalModal } from '../../../models';
import { TodoService, AppService } from '../../../service';
import * as moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss'],
})
export class TodoInboxComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dialog') dialog: TemplateRef<any>;
  loader = true;
  extraLoader = false;
  todosC: TodoCompletedListType = {
    totalCount: 0,
    data: []
  };
  todos: TodoListType;
  popupType: string; // popup type - update/delete
  todo: TodoType = null; // single todo object
  conditions: TodoConditions; // aploo refreshfetch conditions
  TODOTYPES: any; // todo types wrt routes
  todoCurrentType: string; // current route
  queryStr = '';
  compltedCount = 0;
  loaderImage = this.appService.loaderImage;
  isDeleting = false;
  extModalConfig: IExternalModal;
  modalSubscription: Subscription;

  constructor(
    private toddService: TodoService,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
  ) {
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  ngOnInit(): void {
    this.TODOTYPES = this.toddService.todoTypes(); // todo types
    this.todoCurrentType = this.TODOTYPES.inbox; // default to inbox
    this.loader = true;
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      this.toddService.listTodoLabels()
    ])
      .pipe(
        map(data => ({
          params: data[0],
          query: data[1],
          labels: data[2]
        }))
      )
      .subscribe(data => {
        const { params = null, query = null, labels } = data;
        const { label = null } = params;
        const { q = '' } = query;
        if (!label) {
          this.todoCurrentType = this.toddService.getCurentRoute();
          this.conditions = this.toddService.getConditions(this.todoCurrentType);
        } else {
          this.todoCurrentType = label;
          const labelId = labels.filter(obj => obj.name === label)[0]._id;
          this.conditions = this.toddService.getConditions(labelId);
        }
        if (q) {
          this.queryStr = q;
          this.conditions = { ...this.conditions, filter: { ...this.conditions.filter, title_contains: this.queryStr } };
        }
        if (this.todoCurrentType === this.TODOTYPES.completed) {
          this.getTotalCount();
          this.getCompletedTodos(this.conditions, true);
        } else {
          this.getTodos(this.conditions);
        }
      });
    this.subscribeToExtTodoAddModal();
  }

  // get priority color
  getPriorityColor(priority: string) {
    return this.toddService.getColor(priority);
  }

  /**
   * @param conditions - based on route
   */
  getTodos(conditions: TodoConditions) {
    this.extraLoader = true;
    this.toddService.listTodos(conditions)
      .subscribe((data: any) => {
        this.todos = data;
        this.extraLoader = false;
      },
        () => {
          this.extraLoader = false;
        });
  }

  /**
   * @param conditions - based on route
   */
  getCompletedTodos(conditions: TodoConditions, isDirectCall = false) {
    this.loader = true;
    if (isDirectCall) {
      conditions.offset = 1;
    }
    this.extraLoader = false;
    this.toddService.listCompletedTodos(conditions)
      .subscribe((data: any) => {
        const { totalCount, data: newdata } = data;
        if (isDirectCall) {
          this.todosC = { totalCount, data: newdata };
        } else {
          this.todosC = { totalCount, data: [...this.todosC.data, ...newdata] };
        }
        if ((totalCount === null) || (newdata === null) || (newdata.length === totalCount)) {
          this.loader = false;
        } else {
          this.loader = true;
        }
      });
  }

  /**
   * @param todo - todo object
   * @param popupType - update/delete
   */
  openPopUp(todo: TodoType, popupType: string): void {
    if (popupType === 'UPDATE') {
      this.appService.externalModal.next({
        ...this.appService.ExternalModelConfig,
        TODO_UPDATE: true
      });
    }
    this.todo = todo; // passing todo object to update dialog
  }

  /**
   * @param todo - todo object
   */
  updateTodo(todo: TodoType) {
    const postBody: TodoType = {
      _id: todo._id,
      isCompleted: (this.todoCurrentType === this.TODOTYPES?.today) ? !todo.isCompleted : true,
      operationType: 'UPDATE'
    };
    this.toddService
      .todoOperation(postBody, this.conditions)
      .subscribe();
  }

  deleteRequest(todo: TodoType) {
    todo.deleteRequest = true;
    setTimeout(() => {
      todo.deleteRequest = false;
    }, 3000);
  }

  /**
   * @param todo - todo object
   */
  deleteTodo(todo: TodoType): void {
    if (todo.deleteRequest) {
      this.isDeleting = true;
      const postBody: TodoType = {
        _id: todo._id,
        operationType: 'DELETE'
      };
      this.toddService
        .todoOperation(postBody, this.conditions)
        .subscribe(() => {
          this.isDeleting = false;
        });
    }
  }

  @HostListener('scroll', ['$event'])
  refresh() {
    const { totalCount, data } = this.todosC;
    // if (this.conditions.offset === ) {
    //   this.getCompletedTodos(this.conditions);
    // } else
    if (data.length < totalCount && this.loader) {
      const { offset } = this.conditions;
      this.conditions = { ...this.conditions, offset: offset + 1 };
      this.getCompletedTodos(this.conditions);
    }
  }

  getTotalCount() {
    const query: TodoConditions = {
      filter: {
        isCompleted: true,
        title_contains: this.queryStr
      }
    };
    this.toddService.listTodosCount(query).subscribe(response => {
      this.compltedCount = response.totalCount;
    });
  }

  get trackIds(): string[] {
    return this.todos.data.map(track => track._id);
  }

  onTodoDrop(event: CdkDragDrop<TodoType[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  checkScheduledDate(date: Date): boolean {
    const diff = moment(new Date(date)).diff((moment(new Date()).format('YYYY-MM-DD')));
    return diff === 0 || diff > 1;
  }

  // used for open & closing of todo add modal
  private subscribeToExtTodoAddModal() {
    this.modalSubscription = this.appService.externalModal.subscribe(data => {
      this.extModalConfig = data;
    });
  }

}
