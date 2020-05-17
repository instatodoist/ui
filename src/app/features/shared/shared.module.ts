import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { QuilljsModule } from 'ngx-quilljs';
import { AppService } from '../../service';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';
import {TodoLabelComponent} from './todo-label/todo-label.component';
import {TodoLabelListComponent} from './todo-label-list/todo-label-list.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { GoalDialogComponent } from '../goal/goal-dialog/goal-dialog.component';
@NgModule({
  declarations: [
    TodoDialogComponent,
    TodoLabelComponent,
    TodoLabelListComponent,
    InfiniteScrollComponent,
    GoalDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot(),
    QuilljsModule
  ],
  exports: [
    TodoDialogComponent,
    TodoLabelComponent,
    TodoLabelListComponent,
    InfiniteScrollComponent,
    GoalDialogComponent
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

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
