import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TODO_LIST_QUERY, TODO_LABEL_QUERY, TODO_UPDATE_MUTATION, TODO_DELETE_MUTATION } from '../../gql/todo.gql';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoConditions, TodoListType, TodoLabelType, TodoType, SuccessType } from '../../models/todo.model';
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
      .valueChanges.pipe(map(({ data }: any) => {
        return data.todoList;
      }));
  }

  listTodoLabels(): Observable<TodoLabelType[]> {
    return this.apollo
      .watchQuery({
        query: TODO_LABEL_QUERY,
        variables: {
          sort: { updatedAt: 'ASC' }
        },
      })
      .valueChanges.pipe(map(({ data }: any) => {
        return data.todoLabelList;
      }));
  }

  updateTodo(todo: TodoType, conditions: any = null): Observable<SuccessType> {
    const todoId = todo._id;
    const postTodo: any = {
      isCompleted: !!todo.isCompleted
    };
    if (todo.title) {
      postTodo.title = todo.title;
    }
    if (todo.labelId) {
      postTodo.label = todo.labelId;
    }
    if (todo.scheduledDate && todo.noDate) {
      postTodo.scheduledDate = todo.scheduledDate;
    } else {
      postTodo.scheduledDate = null;
    }
    const refetchQuery: any = {
      query: TODO_LIST_QUERY
    };
    if (conditions) {
      refetchQuery.variables = conditions;
    }
    return this.apollo.mutate({
      mutation: TODO_UPDATE_MUTATION,
      variables: {
        id: todoId,
        input: postTodo
      },
      refetchQueries: [
        refetchQuery
      ]
    })
    .pipe(map(({ data }: any) => {
      return data.updateTodo;
    }));
  }

  deleteTodo(todoId: string, conditions: any = null): Observable<SuccessType> {
    const refetchQuery: any = {
      query: TODO_LIST_QUERY
    };
    if (conditions) {
      refetchQuery.variables = conditions;
    }
    return this.apollo.mutate({
      mutation: TODO_DELETE_MUTATION,
      variables: {
        id: todoId
      },
      refetchQueries: [refetchQuery]
    })
    .pipe(map(({ data }: any) => {
      return data.deleteTodo;
    }));
  }
}
