import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/people',
    pathMatch: 'full'
  },
  {
    path: 'people',
    loadComponent: () => import('./pages/people-list/people-list.component').then(m => m.PeopleListComponent)
  },
  {
    path: 'people/new',
    loadComponent: () => import('./pages/people-form/people-form.component').then(m => m.PeopleFormComponent)
  },
  {
    path: 'people/:id/edit',
    loadComponent: () => import('./pages/people-form/people-form.component').then(m => m.PeopleFormComponent)
  }
];
