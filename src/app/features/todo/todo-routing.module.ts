import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoInboxComponent } from './todo-inbox/todo-inbox.component';
import { TodoPendingComponent } from './todo-pending/todo-pending.component';
import { TodoLabelFilterComponent } from './todo-label-filter/todo-label-filter.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inbox',
        component: TodoInboxComponent,
        data: {
          header_title: 'inbox'
        }
      },
      {
        path: 'today',
        component: TodoInboxComponent,
        data: {
          header_title: 'today'
        }
      },
      {
        path: 'completed',
        component: TodoInboxComponent,
        data: {
          header_title: 'completed_todos'
        }
      },
      {
        path: 'pending',
        component: TodoPendingComponent,
        data: {
          header_title: 'pending'
        }
      },
      {
        path: 'labels/:labelId/:label',
        component: TodoInboxComponent,
        data: {
          header_title: 'label_filter'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class TodoRoutingModule { }
