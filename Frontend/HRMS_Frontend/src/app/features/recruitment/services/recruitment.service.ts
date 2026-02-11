import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';
import { Vacancy, Candidate, JobApplication } from '../models/recruitment.models';

@Injectable({
    providedIn: 'root'
})
export class RecruitmentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Recruitment`;

    getVacancies(status?: string): Observable<ApiResponse<Vacancy[]>> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        return this.http.get<ApiResponse<Vacancy[]>>(`${this.apiUrl}/vacancies`, { params });
    }

    getApplications(vacancyId?: number): Observable<ApiResponse<JobApplication[]>> {
        let params = new HttpParams();
        if (vacancyId) params = params.set('vacancyId', vacancyId.toString());
        return this.http.get<ApiResponse<JobApplication[]>>(`${this.apiUrl}/applications`, { params });
    }

    createVacancy(vacancy: Partial<Vacancy>): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${this.apiUrl}/vacancies`, vacancy);
    }

    updateVacancy(id: number, vacancy: Partial<Vacancy>): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/vacancies/${id}`, vacancy);
    }

    getInterviews(appId?: number): Observable<ApiResponse<any[]>> {
        let params = new HttpParams();
        if (appId) params = params.set('appId', appId.toString());
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/interviews`, { params });
    }

    recordInterviewResult(id: number, result: any): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/interviews/${id}/result`, result);
    }
}
