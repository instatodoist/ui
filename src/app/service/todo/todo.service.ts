import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserModel } from './../../ngrx/models'
import { TODO_LIST_QUERY } from '../../gql/todo.gql';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})

export class TodoService {
    API_URL = environment.API_URL;
    constructor(private apollo: Apollo) { }
    listTodos() {
        return this.apollo
      .watchQuery({
          query: TODO_LIST_QUERY,
          variables: {
            sort: { updatedAt: 'DESC' }
          },
        })
        .valueChanges.pipe(map(({data}) => {
            return data;
        }));
    }
}