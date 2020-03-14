import { createAction, props } from '@ngrx/store';
import { TodoConditions} from '../models/todo.model';

export const loadTodos = createAction(
  '[Todo] Load Todos',
  props<TodoConditions>()
);

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ data: any }>()
);

export const loadTodosFailure = createAction(
  '[Todo] Load Todos Failure',
  props<{ error: any }>()
);
