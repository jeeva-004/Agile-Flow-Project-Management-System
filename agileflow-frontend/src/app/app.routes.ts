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
import { CommentEditComponent } from './features/comments/comment-edit/comment-edit';
import { CommentCreateComponent } from './features/comments/comment-create/comment-create';
import { CommentListComponent } from './features/comments/comment-list/comment-list';
import { DeveloperDashboardComponent } from './features/dashboard/developer-dashboard/developer-dashboard';
import { PmDashboardComponent } from './features/dashboard/pm-dashboard/pm-dashboard';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard';

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

    path:

      'issues/:id/comments',

    component:

      CommentListComponent

  },

  {

    path:

      'issues/:id/comments/create',

    component:

      CommentCreateComponent

  },

  {

    path:

      'comments/:id/edit',

    component:

      CommentEditComponent

  }
  ,
  {

    path:

      'issues/:issueId/worklogs',

    loadComponent: () => import(

      './features/worklogs/worklog-list/worklog-list'

    )

      .then(

        m => m.WorkLogListComponent

      )

  },

  {

    path:

      'issues/:issueId/worklogs/create',

    loadComponent: () => import(

      './features/worklogs/worklog-create/worklog-create'

    )

      .then(

        m => m.WorkLogCreateComponent

      )

  },

  {

    path:

      'worklogs/:id/edit',

    loadComponent: () => import(

      './features/worklogs/worklog-edit/worklog-edit'

    )

      .then(

        m => m.WorkLogEditComponent

      )

  },
  {

    path: 'dashboard/admin',

    component:

      AdminDashboardComponent

  },

  {

    path: 'dashboard/pm',

    component:

      PmDashboardComponent

  },

  {

    path: 'dashboard/developer',

    component:

      DeveloperDashboardComponent

  }
  ,
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];