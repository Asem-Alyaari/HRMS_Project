import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { Payslip, PayrollRun, EmployeeSalaryStructure } from '../models/payroll.models';

@Injectable({
    providedIn: 'root'
})
export class PayrollService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Payroll`;
    private settingsUrl = `${environment.apiUrl}/PayrollSettings`;

    processMonth(month: number, year: number): Observable<ApiResponse<number>> {
        let params = new HttpParams().set('month', month.toString()).set('year', year.toString());
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/process-month`, {}, { params });
    }

    getPayslip(employeeId: number, month: number, year: number): Observable<ApiResponse<Payslip>> {
        return this.http.get<ApiResponse<Payslip>>(`${this.apiUrl}/payslip/${employeeId}/${month}/${year}`);
    }

    exportBankFile(month: number, year: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export-bank-file/${month}/${year}`, { responseType: 'blob' });
    }

    postToGl(runId: number): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/post-to-gl/${runId}`, {});
    }

    // --- Salary Structure Methods ---

    getEmployeeStructure(employeeId: number): Observable<ApiResponse<EmployeeSalaryStructure>> {
        return this.http.get<ApiResponse<EmployeeSalaryStructure>>(`${this.settingsUrl}/employee-structure/${employeeId}`);
    }

    updateStructure(command: EmployeeSalaryStructure): Observable<ApiResponse<boolean>> {
        // The backend expects SetEmployeeSalaryStructureCommand which matches the DTO structure
        return this.http.put<ApiResponse<boolean>>(`${this.settingsUrl}/update-structure`, command);
    }

    initializeFromGrade(employeeId: number): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.settingsUrl}/initialize-from-grade/${employeeId}`, {});
    }
}
