import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Department {
    deptId: number;
    deptNameAr: string;
    deptNameEn: string;
}

export interface Job {
    jobId: number;
    jobTitleAr: string;
    jobTitleEn: string;
}

@Injectable({
    providedIn: 'root'
})
export class LookupService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Helper to extract items from response
     */
    private extractItems(response: any): any[] {
        // Handle Result<PagedResult<T>>
        if (response?.data?.items && Array.isArray(response.data.items)) {
            return response.data.items;
        }
        // Handle PagedResult<T> directly
        if (response?.items && Array.isArray(response.items)) {
            return response.items;
        }
        // Handle Result<IEnumerable<T>>
        if (response?.data && Array.isArray(response.data)) {
            return response.data;
        }
        // Handle IEnumerable<T> directly
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    }

    /**
     * Get all departments
     */
    getDepartments(): Observable<{ label: string; value: number }[]> {
        return this.http.get<any>(`${this.apiUrl}/Departments?PageNumber=1&PageSize=1000`).pipe(
            map(response => {
                const departments = this.extractItems(response);
                return departments.map((dept: any) => ({
                    label: dept.deptNameAr || dept.nameAr,
                    value: dept.deptId || dept.id
                }));
            })
        );
    }

    /**
     * Get all jobs
     */
    getJobs(): Observable<{ label: string; value: number }[]> {
        return this.http.get<any>(`${this.apiUrl}/Jobs?PageNumber=1&PageSize=1000`).pipe(
            map(response => {
                const jobs = this.extractItems(response);
                return jobs.map((job: any) => ({
                    label: job.jobTitleAr || job.titleAr,
                    value: job.jobId || job.id
                }));
            })
        );
    }

    /**
     * Get all nationalities (countries)
     */
    getNationalities(): Observable<{ label: string; value: number }[]> {
        return this.http.get<any>(`${this.apiUrl}/Countries?PageNumber=1&PageSize=1000`).pipe(
            map(response => {
                const countries = this.extractItems(response);
                return countries.map((country: any) => ({
                    label: country.countryNameAr || country.nameAr,
                    value: country.countryId || country.id
                }));
            })
        );
    }

    /**
     * Get all banks
     */
    getBanks(): Observable<{ label: string; value: number }[]> {
        return this.http.get<any>(`${this.apiUrl}/Banks?PageNumber=1&PageSize=1000`).pipe(
            map(response => {
                const banks = this.extractItems(response);
                return banks.map((bank: any) => ({
                    label: bank.bankNameAr || bank.nameAr,
                    value: bank.bankId || bank.id
                }));
            })
        );
    }

    /**
     * Get all document types
     */
    getDocumentTypes(): Observable<{ label: string; value: number }[]> {
        return this.http.get<any>(`${this.apiUrl}/DocumentTypes?PageNumber=1&PageSize=1000`).pipe(
            map(response => {
                const types = this.extractItems(response);
                return types.map((type: any) => ({
                    label: type.documentTypeNameAr || type.nameAr,
                    value: type.documentTypeId || type.id
                }));
            })
        );
    }
}
