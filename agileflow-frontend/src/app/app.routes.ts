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

}
  ,
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];