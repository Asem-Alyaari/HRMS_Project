import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { LeaveBalance } from '../models/leave.models';
import { InitializeBalancesDto, AdjustBalanceCommand } from '../models/leave-balance.models';

@Injectable({
    providedIn: 'root'
})
export class LeaveBalanceService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Leaves/Balances`;

    // ═══════════════════════════════════════════════════════════
    // Get Employee Balance
    // ═══════════════════════════════════════════════════════════

    getEmployeeBalance(employeeId: number, year?: number): Observable<ApiResponse<LeaveBalance[]>> {
        let params = {};
        if (year) {
            params = { year: year.toString() };
        }
        return this.http.get<ApiResponse<LeaveBalance[]>>(`${this.apiUrl}/employee/${employeeId}`, { params });
    }

    // ═══════════════════════════════════════════════════════════
    // Initialize Yearly Balances
    // ═══════════════════════════════════════════════════════════

    initializeBalances(dto: InitializeBalancesDto): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/initialize`, dto);
    }

    // ═══════════════════════════════════════════════════════════
    // Adjust Balance Manually
    // ═══════════════════════════════════════════════════════════

    adjustBalance(command: AdjustBalanceCommand): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/adjust`, command);
    }
}
