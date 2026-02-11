import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { SystemSetting, PublicHoliday, CreatePublicHoliday } from '../models/leave-configuration.models';

@Injectable({
    providedIn: 'root'
})
export class LeaveConfigurationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/LeaveConfiguration`;

    // ═══════════════════════════════════════════════════════════
    // System Settings
    // ═══════════════════════════════════════════════════════════

    getSettings(): Observable<ApiResponse<SystemSetting[]>> {
        return this.http.get<ApiResponse<SystemSetting[]>>(`${this.apiUrl}/settings`);
    }

    updateSettings(settings: SystemSetting[]): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/settings`, settings);
    }

    // ═══════════════════════════════════════════════════════════
    // Public Holidays
    // ═══════════════════════════════════════════════════════════

    getPublicHolidays(year?: number): Observable<ApiResponse<PublicHoliday[]>> {
        let params = {};
        if (year) {
            params = { year: year.toString() };
        }
        return this.http.get<ApiResponse<PublicHoliday[]>>(`${this.apiUrl}/public-holidays`, { params });
    }

    createPublicHoliday(holiday: CreatePublicHoliday): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/public-holidays`, holiday);
    }

    deletePublicHoliday(id: number): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/public-holidays/${id}`);
    }
}
