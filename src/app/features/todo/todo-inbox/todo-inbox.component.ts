import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { TodoListType, TodoCompletedListType, TodoType, TodoConditions, ITodoTypeCount, ItabName } from '../../../models';
import { TodoService, AppService, UtilityService } from '../../../service';
import { TodoDialogComponent } from '../../shared/todo-dialog/todo-dialog.component';

// declare let $: any;
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss']
})
export class TodoInboxComponent implements OnInit, AfterViewInit, OnDestroy {
  loader = true;
  extraLoader = true;
  todosC: TodoCompletedListType = {
    totalCount: 0,
    data: []
  };
  todos: TodoListType;
  popupType: string; // popup type - update/delete
  todo: TodoType = null; // single todo object
  conditions: TodoConditions; // aploo refreshfetch conditions
  TODOTYPES = this.toddService.todoTypes(); // todo types wrt routes
  todoCurrentType: string; // current route
  queryStr = '';
  compltedCount = 0;
  loaderImage = this.appService.loaderImage;
  isDeleting = false;
  // modalSubscription: Subscription;
  count: ITodoTypeCount;
  tabs: ItabName = {
    [this.TODOTYPES.today]: [
      {
        name: this.TODOTYPES.today,
        isShown: true,
        link: '/tasks/today'
      },
      {
        name: this.TODOTYPES.pending,
        isShown: true,
        link: '/tasks/pending'
      }
    ],
    [this.TODOTYPES.pending]: [
      {
        name: this.TODOTYPES.today,
        isShown: true,
        link: '/tasks/today'
      },
      {
        name: this.TODOTYPES.pending,
        isShown: true,
        link: '/tasks/pending'
      }
    ],
    [this.TODOTYPES.inbox]: [
      {
        name: this.TODOTYPES.inbox,
        isShown: true,
        link: '/tasks/inbox'
      }
    ],
    [this.TODOTYPES.upcoming]: [
      {
        name: this.TODOTYPES.upcoming,
        isShown: true,
        link: '/tasks/upcoming'
      }
    ],
    [this.TODOTYPES.completed]: [
      {
        name: this.TODOTYPES.completed,
        isShown: true,
        link: '/tasks/completed'
      }
    ]
  };
  jQuery = this.utilityService.JQuery;

  constructor(
    private utilityService: UtilityService,
    private toddService: TodoService,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private toastr: UtilityService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.jQuery('[data-toggle="tooltip"]').tooltip();
  }

  ngOnInit(): void {
    this.todoCurrentType = ''; // default to inbox
    this.loader = true;
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      this.toddService.listTodoProjects()
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
          this.tabs = {
            ...this.tabs,
            [label]: [
              {
                name: label,
                isShown: true,
                link: `/tasks/lists/${label}`
              }
            ]
          };
          const labelId = labels.filter(obj => (obj.name).toLowerCase() === label.toLowerCase())[0]._id;
          this.conditions = this.toddService.getConditions(labelId, 'labels');
        }
        if (q) {
          this.queryStr = q;
          this.conditions = { ...this.conditions, filter: { ...this.conditions.filter, title_contains: this.queryStr } };
        }
        if (this.todoCurrentType === this.TODOTYPES.completed) {
          const newQuery = { ...this.conditions, filter: { ...this.conditions.filter, isCompleted: true } };
          this.getTodosCount(newQuery);
          this.getCompletedTodos(this.conditions, true);
        } else {
          this.getTodosCount();
          this.getTodos(this.conditions);
        }
        // title
        if (this.todoCurrentType) {
          this.appService.configureSeo(this.todoCurrentType);
        }
      });
  }

  /**
   * @param conditions - based on route
   */
  getTodos(conditions: TodoConditions): void {
    // this.extraLoader = true;
    this.toddService.listTodos(conditions)
      .subscribe((data: any) => {
        if (typeof (data) !== 'undefined') {
          this.todos = data.todoList;
          this.extraLoader = false;
        }
      },
      () => {
        this.extraLoader = false;
      });
  }

  /**
   * @param conditions - based on route
   */
  getCompletedTodos(conditions: TodoConditions, isDirectCall = false): void {
    this.loader = true;
    if (isDirectCall) {
      conditions.offset = 1;
    }
    this.extraLoader = false;
    this.toddService.listCompletedTodos(conditions)
      .subscribe((data: any) => {
        let dataC: any;
        if (typeof (data) !== 'undefined') {
          dataC = data.todoCompleted;
          const { totalCount, data: newdata } = dataC;
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
        }
      });
  }

  /**
   * @param todo - todo object
   * @param popupType - update/delete
   */
  openPopUp(todo: TodoType): void {
    this.utilityService.openMdcDialog({
      type: 'component',
      value: TodoDialogComponent,
      data: {
        modelId: 'todo-dialog-update',
        todo
      }
    })
      .subscribe((_)=>_);
  }

  /**
   * @param todo - todo object
   */
  updateTodo(todo: TodoType): void {
    const postBody: TodoType = {
      _id: todo._id,
      isCompleted: (this.todoCurrentType === this.TODOTYPES?.today) ? !todo.isCompleted : true,
      operationType: 'UPDATE'
    };
    this.toddService
      .todoOperation(postBody, this.conditions)
      .subscribe(() => {
        // navigate to today route if no pending task
        if (this.todoCurrentType === this.TODOTYPES.pending && !this.count.pending) {
          this.router.navigate(['/tasks/today']);
        }
      });
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
          this.toastr.toastrSuccess('Task Deleted');
        });
    }
  }

  @HostListener('scroll', ['$event'])
  refresh(): void {
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

  getTotalCount(): void {
    const query: TodoConditions = {
      filter: {
        isCompleted: true,
        title_contains: this.queryStr
      }
    };
    this.toddService.listTodosCount(query).subscribe((response: any) => {
      const { completed } = response;
      this.count = { ...this.count, completed: completed.totalCount };
    });
  }

  getTodosCount(query = null): void {
    this.toddService.listTodosCount(query).subscribe((response: ITodoTypeCount) => {
      const { today = 0, pending = 0, inbox = 0, completed = 0, upcoming = 0 } = response;
      this.count = {
        pending,
        today,
        inbox,
        completed,
        upcoming
      };
    });
  }

  get trackIds(): string[] {
    return this.todos.data.map(track => track._id);
  }

  onTodoDrop(event: CdkDragDrop<TodoType[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

}
