import { Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { pendingChangesGuard } from './pending-changes.guard';

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
        .then(m => m.ContentComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./add-patient/add-patient.component')
            .then(m => m.AddPatientComponent),
        canDeactivate: [pendingChangesGuard]
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./add-patient/add-patient.component')
            .then(m => m.AddPatientComponent),
        canDeactivate: [pendingChangesGuard]
      }

    ],
    
  }, {
        path: 'patientDetails/:id',
        loadComponent: () =>
          import('./patient-view/patient-view.component')
            .then(m => m.PatientViewComponent)
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
