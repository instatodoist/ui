import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoInboxComponent } from './todo-inbox/todo-inbox.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: TodoInboxComponent,
        data: {
          header_title: 'inbox'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
