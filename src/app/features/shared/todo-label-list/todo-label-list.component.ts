import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../service/todo/todo.service';
import { TodoLabelType } from '../../../models/todo.model';


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
        console.log(this.labels)
      });
  }
}
