import { Routes } from '@angular/router';
import { PayrollListComponent } from './pages/payroll-list/payroll-list.component';

export const PAYROLL_ROUTES: Routes = [
    {
        path: '',
        component: PayrollListComponent,
        data: { title: 'إدارة الرواتب' }
    }
];
