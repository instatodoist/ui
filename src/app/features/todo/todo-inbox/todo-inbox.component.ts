import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TodoListType, TodoCompletedListType, TodoType } from '../../../models/todo.model';
import { TodoConditions } from '../../../models/todo.model';
import { TodoService } from '../../../service/todo/todo.service';
import { merge, mergeMap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
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
  extraLoader = false;
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
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams
    ])
      .pipe(
        map(data => ({
          params: data[0],
          query: data[1]
        }))
      )
      .subscribe(data => {
        const { params = null, query = null } = data;
        const { label = null, labelId = null } = params;
        const { q = null } = query;
        if (!labelId) {
          this.todoCurrentType = this.toddService.getCurentRoute();
          this.conditions = this.toddService.getConditions(this.todoCurrentType);
        } else {
          this.todoCurrentType = label;
          this.conditions = this.toddService.getConditions(labelId);
        }
        if (q) {
          this.queryStr = q;
          this.conditions = { ...this.conditions, filter: { ...this.conditions.filter, title_contains: this.queryStr } };
        }
        this.todoCurrentType === this.TODOTYPES.completed ? this.getCompletedTodos(this.conditions) : this.getTodos(this.conditions);
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
    this.extraLoader = true;
    this.toddService.listTodos(conditions)
      .subscribe((data: any) => {
        this.todos = data;
        this.extraLoader = false;
      });
  }

  /**
   * @param conditions - based on route
   */
  getCompletedTodos(conditions: TodoConditions) {
    this.extraLoader = false;
    this.toddService.listCompletedTodos(conditions)
      .subscribe((data: any) => {
        const { totalCount, data: newdata } = data;
        this.todosC = { totalCount, data: [...this.todosC.data, ...newdata] };
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
      this.getCompletedTodos(this.conditions);
    } else if (data.length) {
      this.loader = false;
    }
  }
}
