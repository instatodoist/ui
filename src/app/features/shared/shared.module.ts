import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../../service';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';
import {TodoLabelComponent} from './todo-label/todo-label.component';
import {TodoLabelListComponent} from './todo-label-list/todo-label-list.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';

@NgModule({
  declarations: [
    TodoDialogComponent,
    TodoLabelComponent,
    TodoLabelListComponent,
    InfiniteScrollComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    TodoDialogComponent,
    TodoLabelComponent,
    TodoLabelListComponent,
    InfiniteScrollComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ AppService ]
    };
  }
}
