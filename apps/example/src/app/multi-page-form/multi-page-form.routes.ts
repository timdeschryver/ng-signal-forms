import { Routes } from '@angular/router';
import { provideSignalForm } from './multi-page.form';
import { withErrorComponent } from '@ng-signal-form';
import { CustomErrorComponent } from '../custom-input-error.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'step-1',
    pathMatch: 'full',
  },
  {
    path: '',
    providers: [provideSignalForm(), withErrorComponent(CustomErrorComponent)],
    children: [
      {
        path: 'step-1',
        loadComponent: () => import('./step1.component'),
      },
      {
        path: 'step-2',
        loadComponent: () => import('./step2.component'),
      },
      {
        path: 'review',
        loadComponent: () => import('./review.component'),
      },
    ],
  },
];
export default routes;
