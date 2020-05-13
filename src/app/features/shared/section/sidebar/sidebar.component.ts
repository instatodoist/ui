import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../../service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
    completed: 0,
    upcoming: 0
  };
  nav: any = {
    todos: false,
    labels: false
  };

  constructor(
    private router: Router,
    private todoService: TodoService
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
      this.nav = {...this.nav, todos: false, labels: true };
    } else if (url.match('/today') || url.match('/inbox') || url.match('/completed') || url.match('/upcoming') ) {
      this.nav = {...this.nav, todos: true, labels: false};
    }
  }

  getTodosCount(query = {
    filter: {
      isCompleted: true
    }
  }) {
    this.todoService.listTodosCount(query).subscribe((response: any) => {
      const { today = null, pending = null, inbox = null, completed = null, upcoming = null } = response;
      this.count = {
        ...this.count,
        pending: pending.totalCount,
        today: today.totalCount,
        inbox: inbox.totalCount,
        completed: completed.totalCount,
        upcoming: upcoming.totalCount,
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
