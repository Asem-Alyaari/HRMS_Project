import { Routes } from '@angular/router';
import { ViolationsListComponent } from './pages/violations-list/violations-list.component';
import { ViolationTypesComponent } from './pages/violation-types/violation-types.component';
import { DisciplinaryActionsComponent } from './pages/disciplinary-actions/disciplinary-actions.component';
import { KpiConfigComponent } from './pages/kpi-config/kpi-config.component';
import { AppraisalCyclesComponent } from './pages/appraisal-cycles/appraisal-cycles.component';
import { AppraisalFormComponent } from './pages/appraisal-form/appraisal-form.component';

export const PERFORMANCE_ROUTES: Routes = [
    { path: 'violations', component: ViolationsListComponent },
    { path: 'appraisals/new', component: AppraisalFormComponent },
    { path: 'config/violation-types', component: ViolationTypesComponent },
    { path: 'config/disciplinary-actions', component: DisciplinaryActionsComponent },
    { path: 'config/kpis', component: KpiConfigComponent },
    { path: 'config/cycles', component: AppraisalCyclesComponent },
    { path: '', redirectTo: 'violations', pathMatch: 'full' }
];
