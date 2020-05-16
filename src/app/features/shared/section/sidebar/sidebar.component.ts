import { Component, OnInit } from '@angular/core';
import { TodoService, AppService } from '../../../../service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ITodoTypeCount } from '../../../../models';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  isOpen = false;
  count: ITodoTypeCount;
  nav: any = {
    todos: false,
    labels: false,
    goals: false
  };

  constructor(
    private router: Router,
    private todoService: TodoService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getTodosCount();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.updateNav(e.url);
      });

    if (this.router.url) {
      this.updateNav(this.router.url);
    }
  }

  updateNav(url: string): void {
    if (url.match(/labels/g)) {
      this.nav = { ...this.nav, todos: false, goals: false, labels: true };
    } else if (
      url.match('/today') ||
      url.match('/pending') ||
      url.match('/inbox') ||
      url.match('/completed') ||
      url.match('/upcoming')
    ) {
      this.nav = { ...this.nav, todos: true, goals: false, labels: false };
    } else {
      this.nav = { ...this.nav, todos: false, labels: false, goals: true, };
    }
  }

  getTodosCount(query = {
    filter: {
      isCompleted: true
    }
  }) {
    this.todoService.listTodosCount(query).subscribe((response: ITodoTypeCount) => {
      const { today = 0, pending = 0, inbox = 0, completed = 0, upcoming = 0 } = response;
      this.count = {
        ...this.count,
        pending,
        today,
        inbox,
        completed,
        upcoming
      };
    });
  }

  closePopUp($event: boolean): void {
    this.isOpen = $event;
  }

  openPopUp(): void {
    this.isOpen = true;
  }

  openPopUpGeneric(): void {
    // debugger
    this.appService.updateExternalModal({
      ...this.appService.ExternalModelConfig,
      GOAL_ADD: true
    });
  }

}
