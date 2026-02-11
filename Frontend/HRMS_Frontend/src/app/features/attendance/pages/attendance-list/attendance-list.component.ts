import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AttendanceService } from '../../services/attendance.service';
import { TimesheetDay, AttendanceStats } from '../../models/attendance.models';
import { EmployeeService } from '../../../personnel/services/employee.service';
import { AttendanceCorrectionFormComponent } from './attendance-correction-form.component';

@Component({
    selector: 'app-attendance-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        ToolbarModule,
        ToastModule
    ],
    providers: [MessageService, DialogService],
    templateUrl: './attendance-list.component.html',
    styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {
    attendanceService = inject(AttendanceService);
    employeeService = inject(EmployeeService);
    messageService = inject(MessageService);
    dialogService = inject(DialogService);

    timesheet = signal<TimesheetDay[]>([]);
    stats = signal<AttendanceStats | null>(null);
    loading = signal(false);

    employees = signal<any[]>([]);
    selectedEmployee = signal<any>(null);
    selectedDate = signal<Date>(new Date());
    ref: DynamicDialogRef | undefined;

    ngOnInit() {
        this.loadEmployees();
    }

    loadEmployees() {
        this.employeeService.getAll(1, 100).subscribe({
            next: (response: any) => {
                const list = response?.data?.items || response?.items || response?.data || response || [];
                this.employees.set(list);
            }
        });
    }

    loadAttendance() {
        if (!this.selectedEmployee()) {
            this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'يرجى اختيار الموظف أولاً' });
            return;
        }

        const date = this.selectedDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const employeeId = this.selectedEmployee().employeeId;

        this.loading.set(true);

        // Load Stats
        this.attendanceService.getStats(employeeId, month, year).subscribe({
            next: (res) => {
                if (res.succeeded) this.stats.set(res.data);
            }
        });

        // Load Timesheet
        this.attendanceService.getTimesheet(employeeId, month, year).subscribe({
            next: (res) => {
                if (res.succeeded) {
                    this.timesheet.set(res.data);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    openCorrection(item: TimesheetDay) {
        const ref = this.dialogService.open(AttendanceCorrectionFormComponent, {
            header: 'تعديل يدوي للحضور',
            width: '450px',
            data: {
                employeeId: this.selectedEmployee().employeeId,
                date: item.date,
                clockIn: item.clockIn,
                clockOut: item.clockOut
            }
        });

        if (ref) {
            ref.onClose.subscribe((success: boolean) => {
                if (success) {
                    this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث البيانات يدوياً' });
                    this.loadAttendance();
                }
            });
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Present': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Absent': return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'Leave': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Weekend': return 'bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400';
            default: return 'bg-gray-50 text-gray-600';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'Present': return 'حاضر';
            case 'Absent': return 'غائب';
            case 'Leave': return 'إجازة';
            case 'Weekend': return 'عطلة';
            default: return status;
        }
    }
}
