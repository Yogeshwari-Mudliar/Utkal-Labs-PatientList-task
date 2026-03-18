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
      {
  path: 'centers',
  children: [

    // Centers List Page
    {
      path: '',
      loadComponent: () =>
        import('./centers/centers/centers.component')
          .then(m => m.CentersComponent)
    },

    // Center Details (MAIN HUB)
    {
      path: ':id',
      loadComponent: () =>
        import('./centers/center-details/center-details/center-details.component')
          .then(m => m.CenterDetailsComponent),

      children: [

        // Default redirect inside center
        {
          path: '',
          redirectTo: 'departments',
          pathMatch: 'full'
        },

        // Departments
        {
          path: 'departments',
          loadComponent: () =>
            import('./centers/center-details/departments/departments/departments.component')
              .then(m => m.DepartmentsComponent)
        },

        // Positions
        {
          path: 'positions',
          loadComponent: () =>
            import('./centers/center-details/positions/positions/positions.component')
              .then(m => m.PositionsComponent)
        },

        // Staff
        {
          path: 'staff',
          loadComponent: () =>
            import('./centers/center-details/staff/staff/staff.component')
              .then(m => m.StaffComponent)
        }

      ]
    }

  ]
}
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
