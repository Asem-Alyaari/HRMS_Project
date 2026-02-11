import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AttendanceService } from '../../services/attendance.service';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-attendance-management',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, ButtonModule, DatePickerModule, ToastModule, ConfirmDialogModule, TableModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './attendance-management.component.html',
    styleUrls: ['./attendance-management.component.scss']
})
export class AttendanceManagementComponent implements OnInit {
    attendanceService = inject(AttendanceService);
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);

    selectedDate = signal<Date>(new Date());
    processing = signal(false);
    payrollSummary = signal<any[]>([]);

    ngOnInit() {
        this.loadPayrollSummary();
    }

    loadPayrollSummary() {
        const date = this.selectedDate();
        this.attendanceService.getPayrollSummary(date.getMonth() + 1, date.getFullYear()).subscribe({
            next: (res) => {
                if (res.succeeded) this.payrollSummary.set(res.data);
            }
        });
    }

    processAttendance() {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من تشغيل عملية معالجة الحضور للفترة المختارة؟',
            header: 'تأكيد التشغيل',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.processing.set(true);
                const date = this.selectedDate();
                this.attendanceService.processAttendance({
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                }).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تمت معالجة الحضور بنجاح' });
                        this.loadPayrollSummary();
                        this.processing.set(false);
                    },
                    error: () => this.processing.set(false)
                });
            }
        });
    }

    closeMonth() {
        this.confirmationService.confirm({
            message: 'إغلاق الشهر سيمنع أي تعديلات مستقبلية على هذه الفترة. هل تود الاستمرار؟',
            header: 'تأكيد الإغلاق الشهري',
            icon: 'pi pi-lock',
            accept: () => {
                this.processing.set(true);
                const date = this.selectedDate();
                this.attendanceService.processMonthlyClosing({
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                }).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إغلاق الشهر وتثبيت البيانات' });
                        this.processing.set(false);
                    },
                    error: () => this.processing.set(false)
                });
            }
        });
    }
}
