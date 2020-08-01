import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { QuilljsModule } from 'ngx-quilljs';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AppService } from '../../service';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';
import {TodoProjectComponent} from './todo-project/todo-project.component';
import {TodoProjectListComponent} from './todo-project-list/todo-project-list.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { GoalDialogComponent } from '../goal/goal-dialog/goal-dialog.component';
import { FileUploadComponent } from '../shared/file-upload/file-upload.component';
import { CustomDateModalComponent } from './custom-date-modal/custom-date-modal.component';
import { DialogTodoTagsComponent } from './todo-tag-dialog/dialog-todo-tags.component';
import { DialogTodoProjectsComponent } from './todo-project-dialog/dialog-todo-projects.component';
import { FooterComponent } from '../shared/section/footer/footer.component';
// import { ThemeComponent } from './section/theme/theme.component';
@NgModule({
  declarations: [
    TodoDialogComponent,
    TodoProjectComponent,
    TodoProjectListComponent,
    InfiniteScrollComponent,
    GoalDialogComponent,
    FileUploadComponent,
    CustomDateModalComponent,
    DialogTodoTagsComponent,
    DialogTodoProjectsComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      // defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    QuilljsModule,
    LazyLoadImageModule
  ],
  exports: [
    TodoDialogComponent,
    TodoProjectComponent,
    TodoProjectListComponent,
    InfiniteScrollComponent,
    GoalDialogComponent,
    TranslateModule,
    FileUploadComponent,
    CustomDateModalComponent,
    DialogTodoTagsComponent,
    DialogTodoProjectsComponent,
    FooterComponent,
    LazyLoadImageModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
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
