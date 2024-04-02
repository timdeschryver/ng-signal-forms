import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'basic-form',
    pathMatch: 'full',
  },
  {
    path: 'basic-form',
    loadComponent: () => import('./basic-form/basic-form.component'),
  },
  {
    path: 'simple-form',
    loadComponent: () => import('./simple-form/simple-form.component'),
  },
  {
    path: 'multi-page-form',
    loadChildren: () => import('./multi-page-form/multi-page-form.routes'),
  },
  {
    path: 'form-with-cva',
    loadComponent: () => import('./form-with-cva/form-with-cva.component'),
  },
  {
    path: 'validators',
    loadComponent: () => import('./validators/validators.component'),
  },
];
