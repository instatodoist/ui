import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoRoutingModule } from './todo-routing.module';
// import { EffectsModule } from '@ngrx/effects';
// import { TodoEffects } from '../../ngrx/effects/todo.effects';
import { TodoInboxComponent } from './todo-inbox/todo-inbox.component';

@NgModule({
  declarations: [
    TodoInboxComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    // EffectsModule.forFeature([TodoEffects])
  ]
})
export class TodoModule { }
