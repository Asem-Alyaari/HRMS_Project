import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import {
    LeaveRequest,
    CreateLeaveRequest,
    LeaveActionRequest,
    LeaveBalance
} from '../models/leave.models';

@Injectable({
    providedIn: 'root'
})
export class LeaveService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Leaves/Requests`;

    getEmployeeRequests(employeeId: number): Observable<ApiResponse<LeaveRequest[]>> {
        return this.http.get<ApiResponse<LeaveRequest[]>>(`${this.apiUrl}/employee/${employeeId}`);
    }

    getPendingRequests(): Observable<ApiResponse<LeaveRequest[]>> {
        return this.http.get<ApiResponse<LeaveRequest[]>>(`${this.apiUrl}/pending`);
    }

    create(request: CreateLeaveRequest): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(this.apiUrl, request);
    }

    approve(id: number, data: LeaveActionRequest): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/approve`, data);
    }

    reject(id: number, data: LeaveActionRequest): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/reject`, data);
    }

    cancel(id: number, data: LeaveActionRequest): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/cancel`, data);
    }

    getBalances(employeeId: number, year?: number): Observable<ApiResponse<LeaveBalance[]>> {
        let params = {};
        if (year) {
            params = { year: year.toString() };
        }
        return this.http.get<ApiResponse<LeaveBalance[]>>(`${environment.apiUrl}/Leaves/Balances/employee/${employeeId}`, { params });
    }
}
