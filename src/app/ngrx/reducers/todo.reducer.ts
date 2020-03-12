import { Action, createReducer, on } from '@ngrx/store';


export const todoFeatureKey = 'todo';

import * as TodoActions from '../actions/todo.actions';
import { TodoListType} from '../models/todo.model';

export interface TodoState {
  list: TodoListType;
  loader: boolean;
}

export const initialState: TodoState = {
  list: { data: [], totalCount: 0},
  loader: false
};

const todoReducer = createReducer(
  initialState,
  on(
    TodoActions.loadTodosSuccess,
    (state, { data }) => {
      return { ...state, list: data.todoList }
    }
  ),
);

export function _todoReducer(state: TodoState | undefined, action: Action) {
  return todoReducer(state, action);
}
