import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserModel } from './../../ngrx/models'
import { TODO_LIST_QUERY } from '../../gql/todo.gql';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';
import {  TodoConditions} from '../../ngrx/models/todo.model';
@Injectable({
    providedIn: 'root',
})

export class TodoService {
    API_URL = environment.API_URL;
    constructor(private apollo: Apollo) { }

    listTodos(conditions: TodoConditions) {
      return this.apollo
      .watchQuery({
          query: TODO_LIST_QUERY,
          variables: conditions,
        })
        .valueChanges.pipe(map(({data}) => {
            return data;
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
