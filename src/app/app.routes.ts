import { Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';

export const routes: Routes = [
  { path: '', component: ContentComponent },
  // future lazy-loaded or standalone routes can be added here
];
