import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { Loan, LoanInstallment, CreateLoanCommand } from '../models/loan.models';

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Loan`; // Based on LoanController.cs which usually maps to [controller]

    createLoan(command: CreateLoanCommand): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(this.apiUrl, command);
    }

    getEmployeeLoans(employeeId: number): Observable<ApiResponse<Loan[]>> {
        return this.http.get<ApiResponse<Loan[]>>(`${this.apiUrl}/employee/${employeeId}`);
    }

    getLoans(status?: string, employeeId?: number): Observable<ApiResponse<Loan[]>> {
        let params = {};
        if (status) params = { ...params, status };
        if (employeeId) params = { ...params, employeeId };
        return this.http.get<ApiResponse<Loan[]>>(this.apiUrl, { params });
    }

    updateLoanStatus(command: { loanId: number, status: string, adminNotes?: string }): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/update-status`, command);
    }

    getLoanSchedule(loanId: number): Observable<ApiResponse<LoanInstallment[]>> {
        return this.http.get<ApiResponse<LoanInstallment[]>>(`${this.apiUrl}/${loanId}/schedule`);
    }

    getMonthlyInstallments(month: number, year: number): Observable<ApiResponse<LoanInstallment[]>> {
        return this.http.get<ApiResponse<LoanInstallment[]>>(`${this.apiUrl}/monthly-installments?month=${month}&year=${year}`);
    }
}
