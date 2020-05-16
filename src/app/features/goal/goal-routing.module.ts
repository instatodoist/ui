import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalDialogComponent } from './goal-dialog/goal-dialog.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: GoalListComponent,
        data: {
          header_title: 'my_goals'
        }
        // children: [
        //   {
        //     path: 'goalAdd',
        //     component: GoalDialogComponent,
        //     outlet: 'gadd'
        //  }
        // ]
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class GoalRoutingModule { }
