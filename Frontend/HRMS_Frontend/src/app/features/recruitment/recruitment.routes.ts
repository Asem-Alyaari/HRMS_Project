import { Routes } from '@angular/router';
import { VacanciesListComponent } from './pages/vacancies-list/vacancies-list.component';
import { ApplicationsListComponent } from './pages/applications-list/applications-list.component';

export const RECRUITMENT_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'vacancies',
        pathMatch: 'full'
    },
    {
        path: 'vacancies',
        component: VacanciesListComponent,
        data: { title: 'الوظائف الشاغرة' }
    },
    {
        path: 'applications',
        component: ApplicationsListComponent,
        data: { title: 'طلبات التوظيف' }
    }
];
