import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import {
    AttendanceStats,
    TimesheetDay,
    ManualCorrectionRequest,
    MonthlyClosingRequest,
    AttendanceException,
    LiveStatus,
    ShiftSwapRequest,
    OvertimeRequest,
    PermissionRequest,
    CorrectionHistory,
    PayrollAttendanceSummary
} from '../models/attendance.models';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Attendance`;
    private settingsUrl = `${environment.apiUrl}/AttendanceSettings`;

    // ═══════════════════════════════════════════════════════════
    // Core Attendance
    // ═══════════════════════════════════════════════════════════

    getStats(employeeId: number, month: number, year: number): Observable<ApiResponse<AttendanceStats>> {
        let params = new HttpParams()
            .set('employeeId', employeeId.toString())
            .set('month', month.toString())
            .set('year', year.toString());
        return this.http.get<ApiResponse<AttendanceStats>>(`${this.apiUrl}/stats`, { params });
    }

    getTimesheet(employeeId: number, month: number, year: number): Observable<ApiResponse<TimesheetDay[]>> {
        let params = new HttpParams()
            .set('employeeId', employeeId.toString())
            .set('month', month.toString())
            .set('year', year.toString());
        return this.http.get<ApiResponse<TimesheetDay[]>>(`${this.apiUrl}/timesheet`, { params });
    }

    getLiveStatus(): Observable<ApiResponse<LiveStatus>> {
        return this.http.get<ApiResponse<LiveStatus>>(`${this.apiUrl}/dashboard/live`);
    }

    getExceptions(): Observable<ApiResponse<AttendanceException[]>> {
        return this.http.get<ApiResponse<AttendanceException[]>>(`${this.apiUrl}/dashboard/exceptions`);
    }

    manualCorrection(request: ManualCorrectionRequest): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/correction`, request);
    }

    getCorrectionHistory(employeeId: number): Observable<ApiResponse<CorrectionHistory[]>> {
        return this.http.get<ApiResponse<CorrectionHistory[]>>(`${this.apiUrl}/correction-history/${employeeId}`);
    }

    processMonthlyClosing(request: MonthlyClosingRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/monthly-closing`, request);
    }

    getPayrollSummary(month: number, year: number): Observable<ApiResponse<PayrollAttendanceSummary[]>> {
        let params = new HttpParams()
            .set('month', month.toString())
            .set('year', year.toString());
        return this.http.get<ApiResponse<PayrollAttendanceSummary[]>>(`${this.apiUrl}/reports/payroll-summary`, { params });
    }

    registerPunch(command: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/punch`, command);
    }

    // ═══════════════════════════════════════════════════════════
    // Requests & Lifecycle
    // ═══════════════════════════════════════════════════════════

    applySwap(command: any): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.settingsUrl}/apply-swap`, command);
    }

    actionSwapRequest(command: any): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.settingsUrl}/action-swap-request`, command);
    }

    applyOvertime(command: any): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.settingsUrl}/apply-overtime`, command);
    }

    actionOvertime(command: any): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.settingsUrl}/action-overtime`, command);
    }

    applyPermission(command: any): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/permissions`, command);
    }

    actionPermission(command: any): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/permissions/action`, command);
    }

    // ═══════════════════════════════════════════════════════════
    // Roster & Processing
    // ═══════════════════════════════════════════════════════════

    initializeRoster(command: any): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.settingsUrl}/initialize-roster`, command);
    }

    assignShift(command: any): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.settingsUrl}/roster/assign`, command);
    }

    processAttendance(command: any): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.settingsUrl}/process-attendance`, command);
    }

    getMyRoster(): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/my-roster`);
    }
}
