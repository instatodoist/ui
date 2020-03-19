import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoInboxComponent } from './todo-inbox/todo-inbox.component';
import { TodoTodayComponent } from './todo-today/todo-today.component';
import { TodoCompletedComponent } from './todo-completed/todo-completed.component';
import { TodoPendingComponent } from './todo-pending/todo-pending.component';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';


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
        component: TodoTodayComponent,
        data: {
          header_title: 'today'
        }
      },
      {
        path: 'completed',
        component: TodoCompletedComponent,
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, TodoDialogComponent],
  declarations: [TodoDialogComponent],
})
export class TodoRoutingModule { }
