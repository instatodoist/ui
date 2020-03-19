import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalDialogComponent } from './goal-dialog/goal-dialog.component';

const routes: Routes = [
  {
    path: 'list',
    children: [
      {
        path: '',
        component: GoalListComponent,
        data: {
          header_title: 'my_goals'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, GoalDialogComponent],
  declarations: [GoalDialogComponent]
})
export class GoalRoutingModule { }
