import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as TodoActions from '../actions/todo.actions';
import { TodoService } from '../../service/todo/todo.service';
import { TodoListType } from '../models/todo.model';

@Injectable()
export class TodoEffects {

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      concatMap(() =>
        this.todoService.listTodos().pipe(
          map((data: TodoListType) => TodoActions.loadTodosSuccess({ data })),
          catchError(error => of(TodoActions.loadTodosFailure({ error }))))
      )
    );
  });

  constructor(private actions$: Actions, private todoService: TodoService) { }

}
