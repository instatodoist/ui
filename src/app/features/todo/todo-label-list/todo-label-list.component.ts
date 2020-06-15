import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../service';
import { TodoLabelType } from '../../../models';

@Component({
  selector: 'app-todo-tags-list',
  templateUrl: './todo-label-list.component.html',
  styleUrls: ['./todo-label-list.component.scss']
})
export class TodoLabelListComponent implements OnInit {

  constructor(
    private todoService: TodoService
  ) { }

  defaultLabelColor = '#1e3d73'; // default color
  labels: TodoLabelType[] = [];

  ngOnInit(): void {
    this.todoService.listTodoLabels().subscribe( data => {
      this.labels = data;
      console.log(this.labels)
    });
  }

}
