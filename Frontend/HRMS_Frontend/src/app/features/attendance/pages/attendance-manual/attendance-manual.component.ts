import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../../personnel/services/employee.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-attendance-manual',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        TableModule,
        TagModule,
        DatePickerModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './attendance-manual.component.html'
})
export class AttendanceManualComponent implements OnInit {
    private attendanceService = inject(AttendanceService);
    private employeeService = inject(EmployeeService);
    private messageService = inject(MessageService);

    selectedDate = signal<Date>(new Date());
    loading = signal(false);
    searchQuery = signal('');

    // Data stores
    employeesList = signal<any[]>([]);
    attendanceMap = signal<Map<number, any>>(new Map());

    // Computed display list
    displayData = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        return this.employeesList()
            .filter(emp => {
                if (!query) return true;
                const nameMatch = (emp.fullNameAr || '').toLowerCase().includes(query);
                const idMatch = (emp.employeeId || '').toString().includes(query);
                return nameMatch || idMatch;
            })
            .map(emp => {
                const att = this.attendanceMap().get(emp.employeeId);
                return {
                    ...emp,
                    clockIn: att?.clockIn || null,
                    clockOut: att?.clockOut || null,
                    status: att?.status || 'لم يحضر'
                };
            });
    });

    ngOnInit() {
        this.loadFullSheet();
    }

    loadFullSheet() {
        this.loading.set(true);
        console.log('Loading employees for attendance sheet...');

        this.employeeService.getAll(1, 1000).subscribe({
            next: (res: any) => {
                console.log('Employees API Response:', res);

                // Determine source of data (handle PaginatedResult or simple array)
                let emps = [];
                if (res?.data?.items) emps = res.data.items;
                else if (res?.items) emps = res.items; // Direct paginated result
                else if (Array.isArray(res?.data)) emps = res.data;
                else if (Array.isArray(res)) emps = res;

                if (!emps || emps.length === 0) {
                    console.warn('No employees found in response');
                }

                // Normalization: Ensure properties are correctly cased for the frontend
                const normalized = emps.map((e: any) => ({
                    // Map IDs (check all common variations)
                    employeeId: e.employeeId ?? e.EmployeeId ?? e.id ?? e.Id,
                    // Map Names
                    fullNameAr: e.fullNameAr ?? e.FullNameAr ?? e.fullName ?? e.FullName ?? e.nameAr ?? e.NameAr ?? 'موظف بدون اسم',
                    // Map Jobs
                    jobTitleAr: e.jobTitleAr ?? e.jobTitle ?? e.JobTitleAr ?? e.JobTitle ?? e.jobTitleEn ?? 'موظف',
                    // Map Shift
                    shiftName: e.shiftName ?? e.ShiftName ?? 'صباحية أساسية'
                }));

                console.log('Normalized Employees:', normalized);
                this.employeesList.set(normalized);
                this.attendanceMap.set(new Map());
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading employees:', err);
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تحميل قائمة الموظفين' });
                this.loading.set(false);
            }
        });
    }

    togglePunch(employeeId: number, type: 'IN' | 'OUT') {
        const dateStr = this.selectedDate().toISOString().split('T')[0];
        const now = new Date();
        const timeStr = `${dateStr}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;

        const command = {
            employeeId: employeeId,
            punchType: type,
            punchTime: timeStr,
            deviceId: 'MANUAL_SHEET',
            locationCoordinates: '0,0'
        };

        this.attendanceService.registerPunch(command).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'تم التحضير',
                    detail: `تم تسجيل ${type === 'IN' ? 'حضور' : 'انصراف'} الموظف بنجاح`
                });

                // Update local state
                const currentMap = new Map(this.attendanceMap());
                const currentAtt = currentMap.get(employeeId) || {};

                if (type === 'IN') currentAtt.clockIn = now;
                else currentAtt.clockOut = now;

                currentAtt.status = currentAtt.clockIn && currentAtt.clockOut ? 'مكتمل' : 'حاضر';
                currentMap.set(employeeId, currentAtt);
                this.attendanceMap.set(currentMap);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تسجيل الحركة' });
            }
        });
    }

    getStatusSeverity(status: string): any {
        switch (status) {
            case 'مكتمل': return 'success';
            case 'حاضر': return 'info';
            case 'لم يحضر': return 'secondary';
            default: return 'warn';
        }
    }
}
