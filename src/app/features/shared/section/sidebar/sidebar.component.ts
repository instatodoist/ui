import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TodoService } from '../../../../service/todo/todo.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  isOpen = false;
  count = {
    inbox: 0,
    today: 0,
    pending: 0,
    completed: 0
  };
  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.callTodoCountService();
  }

  callTodoCountService() {
    this.todoService.callTodoCountService()
      .subscribe(response => {
        this.count = {
          inbox: response[0].totalCount,
          today: response[1].totalCount,
          pending: response[2].totalCount,
          completed: response[3].totalCount
        };
    });
  }

  closePopUp($event: boolean): void {
    this.isOpen = $event;
  }

  openPopUp(): void {
    this.isOpen = true;
  }

}
