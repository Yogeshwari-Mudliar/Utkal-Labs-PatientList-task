import { Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'patients',
    pathMatch: 'full'
  },

  {
    path: 'patients',
    loadComponent: () =>
      import('./content/content.component')
      .then(m => m.ContentComponent)
  },

  {
    path: 'addPatient',
    loadComponent: () =>
      import('./add-patient/add-patient.component')
      .then(m => m.AddPatientComponent)
  },

  // {
  //   path: 'billing',
  //   loadChildren: () =>
  //     import('./modules/billing/billing.module')
  //     .then(m => m.BillingModule)
  // },

  // {
  //   path: 'recruitment',
  //   loadChildren: () =>
  //     import('./modules/recruitment/recruitment.module')
  //     .then(m => m.RecruitmentModule)
  // }
];
