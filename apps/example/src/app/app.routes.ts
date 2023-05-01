import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'simple-form',
    pathMatch: 'full'
  },
  {
    path: 'simple-form',
    loadComponent: () => import('./simple-form.component')
  },
  {
    path: 'multi-page-form',
    loadChildren: () => import('./multi-page-form/multi-page-form.routes')
  }
];
