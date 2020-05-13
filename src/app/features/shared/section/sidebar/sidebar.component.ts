import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../../service';
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
    this.getTodosCount();
  }

  getTodosCount(query = {
    filter: {
      isCompleted: true
    }
  }) {
    this.todoService.listTodosCount(query).subscribe((response: any) => {
      const { today = 0, pending = 0, inbox = 0, completed = 0 } = response;
      this.count = {
        ...this.count,
        pending: pending.totalCount,
        today: today.totalCount,
        inbox: inbox.totalCount,
        completed: completed.totalCount,
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
