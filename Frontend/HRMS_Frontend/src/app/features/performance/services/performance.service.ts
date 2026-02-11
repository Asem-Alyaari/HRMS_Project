import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import {
    Violation,
    ViolationType,
    DisciplinaryAction,
    RegisterViolationCommand,
    KPI,
    AppraisalCycle,
    SubmitAppraisalCommand,
    Appraisal
} from '../models/performance.models';

@Injectable({
    providedIn: 'root'
})
export class PerformanceService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Performance`;

    // --- Violations ---
    getViolations(employeeId?: number, violationTypeId?: number, fromDate?: string, toDate?: string): Observable<ApiResponse<Violation[]>> {
        let params = new HttpParams();
        if (employeeId) params = params.set('employeeId', employeeId.toString());
        if (violationTypeId) params = params.set('violationTypeId', violationTypeId.toString());
        if (fromDate) params = params.set('fromDate', fromDate);
        if (toDate) params = params.set('toDate', toDate);
        return this.http.get<ApiResponse<Violation[]>>(`${this.apiUrl}/violations`, { params });
    }

    registerViolation(command: RegisterViolationCommand): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/violations`, command);
    }

    // --- Configuration: Violation Types ---
    getViolationTypes(): Observable<ApiResponse<ViolationType[]>> {
        return this.http.get<ApiResponse<ViolationType[]>>(`${this.apiUrl}/config/violation-types`);
    }

    createViolationType(type: Partial<ViolationType>): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/config/violation-types`, type);
    }

    updateViolationType(id: number, type: Partial<ViolationType>): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/config/violation-types/${id}`, type);
    }

    deleteViolationType(id: number): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/config/violation-types/${id}`);
    }

    // --- Configuration: Disciplinary Actions ---
    getDisciplinaryActions(): Observable<ApiResponse<DisciplinaryAction[]>> {
        return this.http.get<ApiResponse<DisciplinaryAction[]>>(`${this.apiUrl}/config/disciplinary-actions`);
    }

    createDisciplinaryAction(action: Partial<DisciplinaryAction>): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/config/disciplinary-actions`, action);
    }

    updateDisciplinaryAction(id: number, action: Partial<DisciplinaryAction>): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/config/disciplinary-actions/${id}`, action);
    }

    deleteDisciplinaryAction(id: number): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/config/disciplinary-actions/${id}`);
    }

    // --- KPI Library ---
    getKpis(): Observable<ApiResponse<KPI[]>> {
        return this.http.get<ApiResponse<KPI[]>>(`${this.apiUrl}/config/kpis`);
    }

    createKpi(kpi: Partial<KPI>): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/config/kpis`, kpi);
    }

    updateKpi(id: number, kpi: Partial<KPI>): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/config/kpis/${id}`, kpi);
    }

    deleteKpi(id: number): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/config/kpis/${id}`);
    }

    // --- Appraisal Cycles ---
    getAppraisalCycles(): Observable<ApiResponse<AppraisalCycle[]>> {
        return this.http.get<ApiResponse<AppraisalCycle[]>>(`${this.apiUrl}/config/appraisal-cycles`);
    }

    createAppraisalCycle(cycle: Partial<AppraisalCycle>): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/config/appraisal-cycles`, cycle);
    }

    updateAppraisalCycle(id: number, cycle: Partial<AppraisalCycle>): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/config/appraisal-cycles/${id}`, cycle);
    }

    deleteAppraisalCycle(id: number): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/config/appraisal-cycles/${id}`);
    }

    // --- Appraisals ---
    submitAppraisal(command: SubmitAppraisalCommand): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/appraisals`, command);
    }
}
