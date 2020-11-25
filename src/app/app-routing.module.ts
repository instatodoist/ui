import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './layouts/admin/admin.component';
import { CanActivateAuthenticateGuard } from './guards/can-activate-authenticate.guard';
import { PageNotFoundComponent } from './features/shared/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateAuthenticateGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        component: AdminComponent,
        path: 'smart-analysis',
        loadChildren: () => import('./features/smart-analysis/smart-analysis.module').then(m => m.SmartAnalysisModule)
      },
      {
        component: AdminComponent,
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        component: AdminComponent,
        path: 'tasks',
        loadChildren: () => import('./features/todo/todo.module').then(m => m.TodoModule)
      },
      {
        component: AdminComponent,
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
