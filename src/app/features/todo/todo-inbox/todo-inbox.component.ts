import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadTodos, loadTodosSuccess, loadTodosFailure } from '../../../ngrx/actions/todo.actions';
import { TodoState } from '../../../ngrx/reducers/todo.reducer';
import { TodoListType } from '../../../ngrx/models/todo.model';
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss'],
})
export class TodoInboxComponent implements OnInit {
  loader: boolean;
  todos: TodoListType;

  constructor(private store: Store<{ todo: TodoState }>) { }

  ngOnInit(): void {
    this.store.dispatch(loadTodos());
    this.store.pipe(select('todo')).subscribe((data: any) => {
      this.todos = data.list;
      console.log(this.todos);
    })
  }

}
