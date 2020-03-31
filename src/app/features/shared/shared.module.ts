import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';

@NgModule({
  declarations: [
    TodoDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    TodoDialogComponent
  ]
})
export class SharedModule { }
