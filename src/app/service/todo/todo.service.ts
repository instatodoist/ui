import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TODO_LIST_QUERY } from '../../gql/todo.gql';
import {Apollo} from 'apollo-angular';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {  TodoConditions, TodoListType} from '../../models/todo.model';
@Injectable({
    providedIn: 'root',
})

export class TodoService {
    API_URL = environment.API_URL;
    constructor(private apollo: Apollo) { }

    listTodos(conditions: TodoConditions): Observable<TodoListType> {
      return this.apollo
      .watchQuery({
          query: TODO_LIST_QUERY,
          variables: conditions,
          fetchPolicy: 'network-only'
        })
        .valueChanges.pipe(map(({data}: any ) => {
          return data.todoList;
        }));
    }

    listTodoLabels() {
      return this.apollo
        .watchQuery({
            query: TODO_LIST_QUERY,
            variables: {
              sort: { updatedAt: 'ASC' }
            },
          })
          .valueChanges.pipe(map(({data}) => {
              return data;
          }));
  }
}
