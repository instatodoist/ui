import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoRoutingModule } from './todo-routing.module';
import { TodoInboxComponent } from './todo-inbox/todo-inbox.component';
import { TodoTodayComponent } from './todo-today/todo-today.component';
import { TodoCompletedComponent } from './todo-completed/todo-completed.component';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';
import { TodoDeleteComponent } from './todo-delete/todo-delete.component';
import { TodoPendingComponent } from './todo-pending/todo-pending.component';

@NgModule({
  declarations: [
    TodoInboxComponent,
    TodoTodayComponent,
    TodoCompletedComponent,
    TodoDialogComponent,
    TodoDeleteComponent,
    TodoPendingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TodoRoutingModule
  ],
  exports: [
    TodoDialogComponent,
    TodoDeleteComponent,
    TodoPendingComponent
  ]
})
export class TodoModule { }
