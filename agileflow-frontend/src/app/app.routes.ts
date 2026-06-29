import { Routes } from '@angular/router';

import { Login }
  from './features/auth/login/login';
import { UserList } from './features/users/user-list/user-list';

import { authGuard }
  from './core/guards/auth.guard';
import { ProjectListComponent } from './features/projects/project-list/project-list';
import { ProjectCreateComponent } from './features/projects/project-create/project-create';
import { ProjectEditComponent } from './features/projects/project-edit/project-edit';
import { ProjectMembersComponent } from './features/project-members/project-members';
import { SprintCreateComponent } from './features/sprints/sprint-create/sprint-create';
import { SprintEditComponent } from './features/sprints/sprint-edit/sprint-edit';
import { SprintListComponent } from './features/sprints/sprint-list/sprint-list';
import { IssueCreate } from './features/issues/issue-create/issue-create';
import { IssueEdit } from './features/issues/issue-edit/issue-edit';
import { IssueListComponent } from './features/issues/issue-list/issue-list';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/users/user-list/user-list'
      ).then(
        m => m.UserList
      )
  },
  {
    path: 'users/create',

    canActivate: [authGuard],

    loadComponent: () =>
      import(
        './features/users/user-create/user-create'
      ).then(
        m => m.UserCreateComponent
      )
  },

  {
    path: 'users/edit/:id',

    canActivate: [authGuard],

    loadComponent: () =>
      import(
        './features/users/user-edit/user-edit'
      ).then(
        m => m.UserEditComponent
      )
  },
  {

    path: 'projects',

    component:

      ProjectListComponent

  },

  {

    path:

      'projects/create',

    component:

      ProjectCreateComponent

  }
  ,
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {

    path:

      'projects/:id/edit',

    component:
      ProjectEditComponent
  },
  {

    path:

      'projects/:id/members',

    component:

      ProjectMembersComponent

  },
  {
    path:
      'projects/:id/sprints',

    component:
      SprintListComponent
  },

  {
    path:
      'projects/:id/sprints/create',

    component:
      SprintCreateComponent
  },

  {
    path:
      'sprints/:id/edit',

    component:
      SprintEditComponent
  },
  {

    path:

      'projects/:id/issues',

    component:

      IssueListComponent

  },

  {

    path:

      'projects/:id/issues/create',

    component:

      IssueCreate

  },

  {

    path:


      'issues/:id/edit',

    component:

      IssueEdit
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];