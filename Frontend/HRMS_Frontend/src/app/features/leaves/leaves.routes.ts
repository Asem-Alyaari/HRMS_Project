import { Routes } from '@angular/router';
import { LeaveListComponent } from './pages/leave-list/leave-list.component';
import { LeaveDashboardComponent } from './pages/leave-dashboard/leave-dashboard.component';
import { LeaveBalancesComponent } from './pages/leave-balances/leave-balances.component';
import { LeaveReportsComponent } from './pages/leave-reports/leave-reports.component';

export const LEAVE_ROUTES: Routes = [
    {
        path: '',
        component: LeaveListComponent,
        data: { title: 'إدارة طلبات الإجازات' }
    },
    {
        path: 'dashboard',
        component: LeaveDashboardComponent,
        data: { title: 'لوحة معلومات الإجازات' }
    },
    {
        path: 'balances',
        component: LeaveBalancesComponent,
        data: { title: 'إدارة أرصدة الإجازات' }
    },
    {
        path: 'reports',
        component: LeaveReportsComponent,
        data: { title: 'تقارير الإجازات' }
    }
];
