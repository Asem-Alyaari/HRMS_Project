import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { LeaveRequest } from '../models/leave.models';
import {
    BulkApproveCommand,
    BulkApproveResult,
    ApprovalStats,
    TransactionReportFilters,
    LeaveTransactionReport,
    PayrollLeave
} from '../models/leave-approvals.models';

@Injectable({
    providedIn: 'root'
})
export class LeaveApprovalsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Leaves/Approvals`;

    // ═══════════════════════════════════════════════════════════
    // Bulk Approval
    // ═══════════════════════════════════════════════════════════

    bulkApprove(command: BulkApproveCommand): Observable<ApiResponse<BulkApproveResult>> {
        return this.http.post<ApiResponse<BulkApproveResult>>(`${this.apiUrl}/bulk`, command);
    }

    // ═══════════════════════════════════════════════════════════
    // Dashboard & Stats
    // ═══════════════════════════════════════════════════════════

    getStats(): Observable<ApiResponse<ApprovalStats>> {
        return this.http.get<ApiResponse<ApprovalStats>>(`${this.apiUrl}/stats`);
    }

    getDelayed(): Observable<ApiResponse<LeaveRequest[]>> {
        return this.http.get<ApiResponse<LeaveRequest[]>>(`${this.apiUrl}/delayed`);
    }

    // ═══════════════════════════════════════════════════════════
    // Reports
    // ═══════════════════════════════════════════════════════════

    getTransactionReport(filters: TransactionReportFilters): Observable<ApiResponse<LeaveTransactionReport[]>> {
        let params = new HttpParams();

        if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
        if (filters.toDate) params = params.set('toDate', filters.toDate);
        if (filters.employeeId) params = params.set('employeeId', filters.employeeId.toString());
        if (filters.status) params = params.set('status', filters.status);

        return this.http.get<ApiResponse<LeaveTransactionReport[]>>(`${this.apiUrl}/reports/transactions`, { params });
    }

    getPayrollReport(month: number, year: number): Observable<ApiResponse<PayrollLeave[]>> {
        const params = new HttpParams()
            .set('month', month.toString())
            .set('year', year.toString());

        return this.http.get<ApiResponse<PayrollLeave[]>>(`${this.apiUrl}/reports/payroll`, { params });
    }
}
