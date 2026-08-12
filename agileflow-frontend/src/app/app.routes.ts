import { Routes, Router } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { inject } from '@angular/core';
import { ProjectService } from './features/projects/services/project.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const issuesRedirectGuard = () => {
  const projectService = inject(ProjectService);
  const router = inject(Router);

  return projectService.getProjects(0, 1).pipe(
    map(res => {
      if (res.success && res.data && res.data.content && res.data.content.length > 0) {
        const firstProjectId = res.data.content[0].id;
        return router.createUrlTree(['/projects', firstProjectId, 'issues']);
      }
      return router.createUrlTree(['/projects']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/projects']));
    })
  );
};

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/users/components/user-form/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'users/:id/edit',
        loadComponent: () => import('./features/users/components/user-form/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent)
      },
      {
        path: 'projects/new',
        loadComponent: () => import('./features/projects/components/project-form/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () => import('./features/projects/components/project-form/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'projects/:id/members',
        loadComponent: () => import('./features/projects/components/project-members/project-members.component').then(m => m.ProjectMembersComponent)
      },
      {
        path: 'projects/:id/activity',
        loadComponent: () => import('./features/projects/components/activity-list/activity-list.component').then(m => m.ActivityListComponent)
      },
      {
        path: 'projects/:id/analytics',
        loadComponent: () => import('./features/projects/components/project-analytics/project-analytics.component').then(m => m.ProjectAnalyticsComponent)
      },
      {
        path: 'projects/:id/sprints',
        loadComponent: () => import('./features/sprints/sprint-list/sprint-list.component').then(m => m.SprintListComponent)
      },
      {
        path: 'projects/:projectId/sprints/new',
        loadComponent: () => import('./features/sprints/components/sprint-form/sprint-form.component').then(m => m.SprintFormComponent)
      },
      {
        path: 'projects/:projectId/sprints/:id/edit',
        loadComponent: () => import('./features/sprints/components/sprint-form/sprint-form.component').then(m => m.SprintFormComponent)
      },
      {
        path: 'projects/:id/issues',
        loadComponent: () => import('./features/issues/issue-list/issue-list.component').then(m => m.IssueListComponent)
      },
      {
        path: 'projects/:projectId/issues/new',
        loadComponent: () => import('./features/issues/components/issue-form/issue-form.component').then(m => m.IssueFormComponent)
      },
      {
        path: 'projects/:projectId/issues/:id',
        loadComponent: () => import('./features/issues/issue-detail/issue-detail.component').then(m => m.IssueDetailComponent)
      },
      {
        path: 'projects/:projectId/issues/:id/edit',
        loadComponent: () => import('./features/issues/components/issue-form/issue-form.component').then(m => m.IssueFormComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notification-list/notification-list.component').then(m => m.NotificationListComponent)
      },
      {
        path: 'issues',
        canActivate: [issuesRedirectGuard],
        loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent)
      }
    ]
  }
];
