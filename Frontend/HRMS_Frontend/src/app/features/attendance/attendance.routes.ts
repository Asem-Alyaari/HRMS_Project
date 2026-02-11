import { Routes } from '@angular/router';
import { AttendanceListComponent } from './pages/attendance-list/attendance-list.component';

export const ATTENDANCE_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/attendance-dashboard/attendance-dashboard.component').then(m => m.AttendanceDashboardComponent),
                data: { title: 'لوحة التحكم' }
            },
            {
                path: 'list',
                component: AttendanceListComponent,
                data: { title: 'سجل الحضور' }
            },
            {
                path: 'requests',
                loadComponent: () => import('./pages/attendance-requests/attendance-requests.component').then(m => m.AttendanceRequestsComponent),
                data: { title: 'تقديم الطلبات' }
            },
            {
                path: 'management',
                loadComponent: () => import('./pages/attendance-management/attendance-management.component').then(m => m.AttendanceManagementComponent),
                data: { title: 'إدارة وإغلاق الحضور' }
            },
            {
                path: 'roster',
                loadComponent: () => import('./pages/roster-management/roster-management.component').then(m => m.RosterManagementComponent),
                data: { title: 'إدارة المناوبات' }
            },
            {
                path: 'punch',
                loadComponent: () => import('./pages/attendance-punch/attendance-punch.component').then(m => m.AttendancePunchComponent),
                data: { title: 'تسجيل البصمة' }
            },
            {
                path: 'manual',
                loadComponent: () => import('./pages/attendance-manual/attendance-manual.component').then(m => m.AttendanceManualComponent),
                data: { title: 'التحضير اليدوي' }
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
