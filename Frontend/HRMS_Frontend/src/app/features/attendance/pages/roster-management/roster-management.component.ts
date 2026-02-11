import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { SetupService } from '../../../setup/services/setup.service';
import { EmployeeService } from '../../../personnel/services/employee.service';

@Component({
    selector: 'app-roster-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        DatePickerModule,
        SelectModule,
        TableModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './roster-management.component.html'
})
export class RosterManagementComponent implements OnInit {
    private fb = inject(FormBuilder);
    private attendanceService = inject(AttendanceService);
    private setupService = inject(SetupService);
    private employeeService = inject(EmployeeService);
    private messageService = inject(MessageService);

    initForm: FormGroup;
    assignForm: FormGroup;

    shiftTypes = signal<any[]>([]);
    employees = signal<any[]>([]);
    loading = signal(false);

    constructor() {
        this.initForm = this.fb.group({
            employeeId: [null, Validators.required],
            shiftId: [null, Validators.required],
            startDate: [new Date(), Validators.required],
            endDate: [new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), Validators.required]
        });

        this.assignForm = this.fb.group({
            employeeId: [null, Validators.required],
            shiftId: [null, Validators.required],
            startDate: [new Date(), Validators.required],
            endDate: [new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), Validators.required]
        });
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.setupService.getAll<any>('AttendanceSettings/shifts').subscribe({
            next: (res: any) => {
                const data = Array.isArray(res) ? res : res?.data || [];
                this.shiftTypes.set(data.map((s: any) => ({
                    label: s.shiftNameAr ?? s.shiftNameEn ?? s.shiftName,
                    value: s.shiftId,
                    times: `${s.startTime?.substring(0, 5)} - ${s.endTime?.substring(0, 5)}`
                })));
            }
        });

        this.employeeService.getAll(1, 1000).subscribe({
            next: (res: any) => {
                // Determine source of data (handle PaginatedResult or simple array)
                let emps = [];
                if (res?.data?.items) emps = res.data.items;
                else if (res?.items) emps = res.items;
                else if (Array.isArray(res?.data)) emps = res.data;
                else if (Array.isArray(res)) emps = res;

                this.employees.set(emps.map((e: any) => ({
                    label: e.fullNameAr ?? e.FullNameAr ?? e.fullName ?? e.FullName ?? e.nameAr ?? e.NameAr ?? `موظف ${e.employeeId ?? e.EmployeeId ?? e.id ?? e.Id}`,
                    value: e.employeeId ?? e.EmployeeId ?? e.id ?? e.Id,
                    job: e.jobTitleAr ?? e.jobTitle ?? e.JobTitleAr ?? e.JobTitle ?? 'موظف'
                })));
            }
        });
    }

    initializeRoster() {
        if (this.initForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى إكمال جميع الحقول المطلوبة' });
            return;
        }

        this.loading.set(true);
        const val = this.initForm.value;
        const command = {
            employeeId: val.employeeId,
            shiftId: val.shiftId,
            startDate: val.startDate.toISOString(),
            endDate: val.endDate.toISOString()
        };

        this.attendanceService.initializeRoster(command).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تمت تهيئة سجل المناوبات بنجاح' });
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Roster Init Error:', err);
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تهيئة السجل' });
                this.loading.set(false);
            }
        });
    }

    assignShift() {
        if (this.assignForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى إكمال جميع الحقول المطلوبة' });
            return;
        }

        this.loading.set(true);
        const val = this.assignForm.value;
        const startDate = new Date(val.startDate);

        // Match Backend AssignShiftCommand: EmployeeId, ShiftId, Month, Year
        const request = {
            employeeId: val.employeeId,
            shiftId: val.shiftId,
            month: startDate.getMonth() + 1,
            year: startDate.getFullYear(),
            offDays: [5] // Default to Friday as off-day, can be customized later
        };

        this.attendanceService.assignShift(request).subscribe({
            next: (res: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'نجاح',
                    detail: res?.message || 'تم تخصيص الوردية للموظف بنجاح'
                });
                this.loading.set(false);
                this.assignForm.patchValue({ employeeId: null });
            },
            error: (err) => {
                console.error('Assign Shift Error:', err);
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تخصيص الوردية' });
                this.loading.set(false);
            }
        });
    }
}
