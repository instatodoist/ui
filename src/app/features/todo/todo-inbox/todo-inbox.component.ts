import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TodoListType, TodoCompletedListType, TodoType } from '../../../models/todo.model';
import { TodoConditions } from '../../../models/todo.model';
import { TodoService } from '../../../service/todo/todo.service';
declare var $: any;
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoInboxComponent implements OnInit, AfterViewInit {
  @ViewChild('dialog') dialog: TemplateRef<any>;
  loader = false;
  todosC: TodoCompletedListType = {
    totalCount: 0,
    data: []
  };
  todos: TodoListType;
  isUpdate = false; // if update popup
  isDelete = false; // if delete popup
  popupType: string; // popup type - update/delete
  todo: TodoType = null; // single todo object
  conditions: TodoConditions; // aploo refreshfetch conditions
  TODOTYPES: any; // todo types wrt routes
  todoCurrentType: string; // current route
  queryStr = '';

  constructor(
    private toddService: TodoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  ngOnInit(): void {
    this.TODOTYPES = this.toddService.todoTypes(); // todo types
    this.todoCurrentType = this.TODOTYPES.inbox; // default to inbox
    this.loader = true;
    this.checkingRouteTypes();
  }

  checkingRouteTypes() {
    if (this.router.url === '/tasks/today') { // checking route if today
      this.todoCurrentType = this.TODOTYPES.today;
    } else if (this.router.url === '/tasks/completed') { // checking route if completed
      this.todoCurrentType = this.TODOTYPES.completed;
    } else if (this.router.url === '/tasks/inbox') { // checking route if inbox
      this.todoCurrentType = this.TODOTYPES.inbox;
    } else if (this.router.url === '/tasks/pending') { // checking route if inbox
      this.todoCurrentType = this.TODOTYPES.pending;
    }
    if (this.router.url.match('tasks/labels')) { // special case for labelled type
      // this.todoCurrentType = 'label';
      this.activatedRoute.params.subscribe(params => {
        this.todoCurrentType = params.label;
        this.conditions = this.toddService.getConditions(params.labelId);
        this.checkQueryParams();
      });
    } else {
      this.conditions = this.toddService.getConditions(this.todoCurrentType); // default case for all types except labelled
      this.checkQueryParams();
    }
  }

  checkQueryParams(labelRoute = false) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.q) {
        this.queryStr = params.q;
      } else {
        this.queryStr = '';
      }
      this.conditions = { ...this.conditions, filter: { ...this.conditions.filter, title_contains: this.queryStr } };
      if (!labelRoute) {
        this.todoCurrentType === this.TODOTYPES.completed ? this.getCompletedTodos(this.conditions) : this.getTodos(this.conditions);
      } else {
        this.getTodos(this.conditions);
      }
    });
  }

  // get priority color
  getPriorityColor(priority: string) {
    return this.toddService.getColor(priority);
  }

  /**
   * @param conditions - based on route
   */
  getTodos(conditions: TodoConditions) {
    this.loader = true;
    this.toddService.listTodos(conditions)
      .subscribe((data: any) => {
        this.todos = data;
        this.loader = false;
      });
  }

  /**
   * @param conditions - based on route
   */
  getCompletedTodos(conditions: TodoConditions) {
    this.toddService.listCompletedTodos(conditions)
      .subscribe((data: any) => {
        const { totalCount, data: newdata} = data;
        this.todosC = {totalCount, data: [...this.todosC.data, ...newdata]};
        if (totalCount === 0) {
          this.loader = false;
        }
      });
  }

  /**
   * @param todo - todo object
   * @param popupType - update/delete
   */
  openPopUp(todo: TodoType, popupType): void {
    if (popupType === 'UPDATE') {
      this.isUpdate = true;
      this.popupType = 'UPDATE';
    } else {
      this.isDelete = true;
      this.popupType = 'DELETE';
    }
    this.todo = todo; // passing todo object to update dialog
  }

  /**
   * @param $event - flag after closing the popup
   */
  updatePopupFlag($event: boolean): void {
    if (this.popupType === 'UPDATE') {
      this.isUpdate = $event;
    } else {
      this.isDelete = $event;
    }
  }

  /**
   * @param todo - todo object
   */
  updateTodo(todo: TodoType) {
    const postBody: TodoType = {
      _id: todo._id,
      isCompleted: true,
      operationType: 'UPDATE'
    };
    this.toddService
      .todoOperation(postBody, this.conditions)
      .subscribe();
  }

  /**
   * @param todo - todo object
   */
  deleteTodo(todo: TodoType) {
    const postBody: TodoType = {
      _id: todo._id,
      operationType: 'DELETE'
    };
    this.toddService
      .todoOperation(postBody, this.conditions)
      .subscribe();
  }

  refresh() {
    const { totalCount, data } = this.todosC;
    if (data.length < totalCount && this.loader) {
      const { offset } = this.conditions;
      this.conditions = { ...this.conditions, offset: offset + 1 };
      console.log(totalCount, data.length, offset);
      this.getCompletedTodos(this.conditions);
    } else if (data.length) {
      this.loader = false;
    }
  }
}
