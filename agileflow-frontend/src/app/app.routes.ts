import { Routes } from '@angular/router';

import { Login }
  from './features/auth/login/login';
import { UserList } from './features/users/user-list/user-list';

import { authGuard }
  from './core/guards/auth.guard';

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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];