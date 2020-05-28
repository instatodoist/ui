import { Component, OnInit } from '@angular/core';
import { TodoService, AppService } from '../../../../service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ITodoTypeCount, INavLink } from '../../../../models';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  isOpen = false;
  count: ITodoTypeCount;
  navLinks: INavLink[];
  currentUrl = '';

  constructor(
    private router: Router,
    private todoService: TodoService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getTodosCount();
    this.subscribeToCurrentUrl();
  }

  subscribeToCurrentUrl() {
    this.appService.currentUrlObservable.subscribe(currentUrl => {
      this.currentUrl = currentUrl;
      const navLinks = this.nav().filter(item => {
        if (item.link && this.currentUrl.match(new RegExp(item.link, 'g'))) {
          return true;
        } else if (!item.link) {
          const childrenMatch = item.children.filter(chileItem => {
            return this.currentUrl.match(new RegExp(chileItem.link, 'g')) || chileItem.link.match(new RegExp('lists', 'g'));
          });
          if (childrenMatch.length) {
            return true;
          }
          if (
            item.name === 'Lists' &&
            (this.currentUrl.match(new RegExp('lists', 'g')))) {
            return true;
          }
        }
        return false;
      });
      if (navLinks.length) {
        this.navLinks = this.nav().map(item => {
          if (navLinks[0].name === item.name) {
            item.active = true;
          } else {
            item.active = false;
          }
          return item;
        });
      } else {
        this.navLinks = this.nav();
      }
    });
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

  private nav(): INavLink[] {
    return [
      {
        active: true,
        name: 'Tasks',
        icon: 'las la-home',
        children: [
          {
            name: 'Today',
            icon: 'las la-atom',
            link: '/tasks/today'
          },
          {
            name: 'Inbox',
            icon: 'las la-atom',
            link: '/tasks/inbox'
          },
          {
            name: 'Upcoming',
            icon: 'las la-atom',
            link: '/tasks/upcoming'
          },
          {
            name: 'Completed',
            icon: 'las la-atom',
            link: '/tasks/completed'
          },
        ]
      },
      {
        active: false,
        name: 'Lists',
        icon: 'las la-home',
        children: [
          {
            name: '',
            icon: 'las la-atom',
            link: '/lsits'
          }
        ]
      },
      {
        active: false,
        name: 'Notes',
        icon: 'las la-home',
        link: '/notes'
      }
    ];
  }

}
