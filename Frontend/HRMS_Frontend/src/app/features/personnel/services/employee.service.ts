import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Employee } from '../models/employee.model';
import { CreateEmployeeDto } from '../models/create-employee.dto';
import { EmployeeProfile } from '../models/employee-profile.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/Employees`;

  constructor(private http: HttpClient) { }

  /**
   * Get paginated employees
   */
  getAll(pageNumber: number = 1, pageSize: number = 10, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Get employee basic details by ID
   */
  getById(id: number): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get full employee profile (Aggregated view)
   */
  getFullProfile(id: number): Observable<EmployeeProfile> {
    return this.http.get<any>(`${environment.apiUrl}/employee-profile/${id}/full-profile`).pipe(
      map(response => response.data || response)
    );
  }

  /**
   * Create a new employee with full details
   */
  create(employee: CreateEmployeeDto): Observable<number> {
    return this.http.post<number>(this.apiUrl, employee);
  }

  /**
   * Update employee main info
   */
  update(id: number, employee: Partial<CreateEmployeeDto>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
  }

  /**
   * Upload an employee document
   */
  uploadDocument(employeeId: number, file: File, documentTypeId: number, documentNumber?: string, expiryDate?: string): Observable<any> {
    const formData = new FormData();
    formData.append('EmployeeId', employeeId.toString());
    formData.append('DocumentTypeId', documentTypeId.toString());
    formData.append('File', file);

    if (documentNumber) formData.append('DocumentNumber', documentNumber);
    if (expiryDate) formData.append('ExpiryDate', expiryDate);

    return this.http.post(`${environment.apiUrl}/employee-profile/${employeeId}/documents`, formData);
  }

  /**
   * Add a qualification with optional attachment
   */
  addQualification(employeeId: number, command: any, file?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(command).forEach(key => {
      if (command[key] !== null && command[key] !== undefined) {
        formData.append(key, command[key]);
      }
    });
    if (file) {
      formData.append('Attachment', file);
    }
    return this.http.post(`${environment.apiUrl}/employee-profile/${employeeId}/qualifications`, formData);
  }

  /**
   * Add a certification with optional attachment
   */
  addCertification(employeeId: number, command: any, file?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(command).forEach(key => {
      if (command[key] !== null && command[key] !== undefined) {
        formData.append(key, command[key]);
      }
    });
    if (file) {
      formData.append('Attachment', file);
    }
    return this.http.post(`${environment.apiUrl}/employee-profile/${employeeId}/certifications`, formData);
  }

  /**
   * Add an experience
   */
  addExperience(employeeId: number, experience: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/employee-profile/${employeeId}/experiences`, experience);
  }
}
