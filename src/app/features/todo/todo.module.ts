import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoRoutingModule } from './todo-routing.module';
import { TodoInboxComponent } from './todo-inbox/todo-inbox.component';
import { TodoTodayComponent } from './todo-today/todo-today.component';
import { TodoCompletedComponent } from './todo-completed/todo-completed.component';
@NgModule({
  declarations: [
    TodoInboxComponent,
    TodoTodayComponent,
    TodoCompletedComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule
  ]
})
export class TodoModule { }
