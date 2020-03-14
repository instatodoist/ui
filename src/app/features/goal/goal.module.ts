import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalRoutingModule } from './goal-routing.module';
import { GoalListComponent } from './goal-list/goal-list.component';

@NgModule({
  declarations: [GoalListComponent],
  imports: [
    CommonModule,
    GoalRoutingModule
  ]
})
export class GoalModule { }
