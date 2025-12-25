import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/people',
    pathMatch: 'full'
  },
  {
    path: 'callback',
    loadComponent: () => import('./pages/callback/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: 'people',
    loadComponent: () => import('./pages/people-list/people-list.component').then(m => m.PeopleListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'people/new',
    loadComponent: () => import('./pages/people-form/people-form.component').then(m => m.PeopleFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'people/:id/edit',
    loadComponent: () => import('./pages/people-form/people-form.component').then(m => m.PeopleFormComponent),
    canActivate: [authGuard]
  }
];
