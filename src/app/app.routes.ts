import { Routes } from '@angular/router';
import { MetricsComponent } from './pages/metrics/metrics.component';
import { TicketingComponent } from './pages/ticketing/ticketing.component';

export const routes: Routes = [
  {
    path: '',
    component: MetricsComponent,
  },
  {
    path: 'ticketing',
    component: TicketingComponent
  },
];
