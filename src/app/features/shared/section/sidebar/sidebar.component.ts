import { Component, OnInit } from '@angular/core';
import { TodoService, AppService } from '../../../../service';
import { Router, NavigationEnd } from '@angular/router';
import { ITodoTypeCount, INavLink } from '../../../../models';
import { combineLatest } from 'rxjs';
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
    this.navLinks = this.nav();
    const query = {
      filter: {
        isCompleted: true
      }
    };
    combineLatest([
      this.appService.currentUrlObservable,
      this.todoService.listTodosCount(query)
    ])
      .subscribe((response: any) => {
        const [currentUrl = '', foo] = response;
        const { today = 0, pending = 0, inbox = 0, completed = 0, upcoming = 0 } = foo;
        this.count = {
          ...this.count,
          pending,
          today,
          inbox,
          completed,
          upcoming
        };
        this.attachActiveClass(currentUrl);
        this.navLinks = this.navLinks.map(item => {
          if (item.children && item.children.length) {
            item.children = item.children.map(child => {
              if (child.slug === 'today') {
                child = { ...child, count: this.count.today };
              }
              if (child.slug === 'inbox') {
                child = { ...child, count: this.count.inbox };
              }
              if (child.slug === 'upcoming') {
                child = { ...child, count: this.count.upcoming };
              }
              if (child.slug === 'completed') {
                child = { ...child, count: this.count.completed };
              }
              return child;
            });
          }
          return item;
        });
      });
  }

  attachActiveClass(currentUrl: string) {
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
    }
  }

  private nav(): INavLink[] {
    return [
      {
        active: true,
        name: 'Tasks',
        icon: 'fa fa-tasks',
        children: [
          {
            name: 'Today',
            slug: 'today',
            icon: 'fa fa-calendar',
            link: '/tasks/today',
            count: 0
          },
          {
            name: 'Inbox',
            slug: 'inbox',
            icon: 'fa fa-inbox',
            link: '/tasks/inbox',
            count: 0
          },
          {
            name: 'Upcoming',
            slug: 'upcoming',
            icon: 'fa fa-calendar-plus-o',
            link: '/tasks/upcoming',
            count: 0
          },
          {
            name: 'Completed',
            slug: 'completed',
            icon: 'fa fa-check',
            link: '/tasks/completed',
            count: 0
          },
        ]
      },
      {
        active: false,
        name: 'Lists',
        icon: 'fa fa-list-alt',
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
        icon: 'fa fa-sticky-note-o',
        link: '/notes'
      }
    ];
  }

}
