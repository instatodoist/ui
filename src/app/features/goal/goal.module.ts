import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GoalRoutingModule } from './goal-routing.module';
import { GoalListComponent } from './goal-list/goal-list.component';
// import { GoalDialogComponent } from './goal-dialog/goal-dialog.component';

@NgModule({
  declarations: [
    GoalListComponent,
    // GoalDialogComponent
  ],
  exports: [
    // GoalDialogComponent
  ],
  imports: [
    CommonModule,
    GoalRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class GoalModule { }
