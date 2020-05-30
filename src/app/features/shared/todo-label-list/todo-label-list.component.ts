import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../service/todo/todo.service';
import { TodoLabelType, TodoLabelListType } from '../../../models/todo.model';
import { Observable, from, of, forkJoin, interval } from 'rxjs';
import { mergeMap, concat, toArray, map, scan, mergeAll, concatMap, concatAll, switchMap, flatMap, takeLast, reduce, take, elementAt } from 'rxjs/operators';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';


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
    from(labels)
      .pipe(
        concatMap(item => this.todoService.listTodosQuery(this.todoService.getConditions(item._id, 'labels'))),
        map(item => item.totalCount || 0),
        reduce((acc, curr) => {
          return acc.concat(curr);
        }, [])
      )
      // forkJoin(it)
      .subscribe(
        (response: any) => {
          this.labels = this.labels.map((element, index) => {
            element.count = response[index];
            return element;
          });
          console.log(this.labels)
        },
        err => {
          console.log(err);
        });
  }
}
