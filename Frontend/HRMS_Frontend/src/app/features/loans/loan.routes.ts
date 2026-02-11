import { Routes } from '@angular/router';
import { LoansListComponent } from './pages/loans-list/loans-list.component';
import { LoanRequestsComponent } from './pages/loan-requests/loan-requests.component';

export const LOAN_ROUTES: Routes = [
    { path: 'list', component: LoansListComponent },
    { path: 'requests', component: LoanRequestsComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
];
