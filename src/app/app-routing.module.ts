import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './features/shared/layout/admin/admin.component';
import { CanActivateAuthenticateGuard } from './guards/can-activate-authenticate.guard';
import { PageNotFoundComponent } from './features/shared/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [CanActivateAuthenticateGuard],
    children: [
      {
        path: 'smart-analysis',
        loadChildren: () => import('./features/smart-analysis/smart-analysis.module').then(m => m.SmartAnalysisModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./features/todo/todo.module').then(m => m.TodoModule)
      },
      {
        path: 'notes',
        loadChildren: () => import('./features/goal/goal.module').then(m => m.GoalModule)
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
