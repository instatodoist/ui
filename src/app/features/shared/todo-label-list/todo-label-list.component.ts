import { Component, OnInit } from '@angular/core';
import { TodoService, AppService } from '../../../service';
import { TodoLabelType } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-label-list',
  templateUrl: './todo-label-list.component.html',
  styles: [`
    .child-labels{
      background: var(--iq-light-primary) !important;
    }
  `]
})
export class TodoLabelListComponent implements OnInit {

  labels: TodoLabelType[];
  currentUrl = '';

  constructor(
    private appService: AppService,
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.getLabels();
    this.appService.currentUrlObservable.subscribe( url => {
      this.currentUrl = url;
    });
  }

  getLabels() {
    this.todoService
      .listTodoProjects()
      .subscribe(response => {
        this.labels = response;
      });
  }
}
