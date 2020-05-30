import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../service/todo/todo.service';
import { TodoLabelType, TodoLabelListType } from '../../../models/todo.model';
import { Observable, from, of, forkJoin, interval } from 'rxjs';
import { mergeMap, concat, toArray, map, scan, mergeAll, concatMap, concatAll, switchMap, flatMap, takeLast, reduce, take } from 'rxjs/operators';


@Component({
  selector: 'app-todo-label-list',
  templateUrl: './todo-label-list.component.html',
  styleUrls: ['./todo-label-list.component.scss']
})
export class TodoLabelListComponent implements OnInit {

  labels: TodoLabelType[];

  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.getLabels();
  }

  getLabels() {
    this.todoService
      .listTodoLabels()
      .subscribe(response => {
        this.labels = response;
        this.getCountForLabels(this.labels);
      });
  }

  getCountForLabels(labels: TodoLabelType[]): void {
    const i = interval(2000).pipe(take(2));
    i.subscribe(item => {
      console.log(item, Math.random());
    });
    // from(labels)
    //   .pipe(
    //     mergeMap(item => this.todoService.listTodos(this.todoService.getConditions(item._id, 'labels'))),
    //     map(item => item.totalCount || 0),
    //     scan((acc, curr) => acc.concat(curr), []),
    //   )
    //   // forkJoin(it)
    //   .subscribe(
    //     (response: any) => {
    //     console.log(response);
    //     },
    //     err => {
    //       console.log(err);
    //     });
  }
}
