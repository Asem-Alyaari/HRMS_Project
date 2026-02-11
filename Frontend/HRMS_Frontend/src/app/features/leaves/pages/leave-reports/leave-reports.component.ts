import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LeaveApprovalsService } from '../../services/leave-approvals.service';
import { LeaveTransactionReport, PayrollLeave, TransactionReportFilters } from '../../models/leave-approvals.models';

@Component({
    selector: 'app-leave-reports',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TabsModule,
        TableModule,
        ButtonModule,
        DatePickerModule,
        SelectModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './leave-reports.component.html',
    styleUrls: ['./leave-reports.component.scss']
})
export class LeaveReportsComponent implements OnInit {
    approvalsService = inject(LeaveApprovalsService);
    messageService = inject(MessageService);

    // Transaction Report Data
    transactionFilters: TransactionReportFilters = {
        status: '',
        employeeId: undefined,
        fromDate: undefined,
        toDate: undefined
    };
    transactions = signal<LeaveTransactionReport[]>([]);
    loadingTransactions = signal(false);

    // Payroll Report Data
    payrollMonth = new Date().getMonth() + 1;
    payrollYear = new Date().getFullYear();
    payrollData = signal<PayrollLeave[]>([]);
    loadingPayroll = signal(false);

    statusOptions = [
        { label: 'الكل', value: '' },
        { label: 'قيد الانتظار', value: 'Pending' },
        { label: 'مقبول', value: 'Approved' },
        { label: 'مرفوض', value: 'Rejected' },
        { label: 'ملغى', value: 'Cancelled' }
    ];

    ngOnInit() {
        // Initial load could be empty or default
    }

    loadTransactionReport() {
        this.loadingTransactions.set(true);
        // Format dates to ISO strings if present
        const filters = { ...this.transactionFilters };
        if (filters.fromDate) filters.fromDate = new Date(filters.fromDate).toISOString();
        if (filters.toDate) filters.toDate = new Date(filters.toDate).toISOString();

        this.approvalsService.getTransactionReport(filters).subscribe({
            next: (res: any) => {
                const data = res?.data || res || [];
                this.transactions.set(Array.isArray(data) ? data : []);
                this.loadingTransactions.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل تقرير المعاملات' });
                this.loadingTransactions.set(false);
            }
        });
    }

    loadPayrollReport() {
        this.loadingPayroll.set(true);
        this.approvalsService.getPayrollReport(this.payrollMonth, this.payrollYear).subscribe({
            next: (res: any) => {
                const data = res?.data || res || [];
                this.payrollData.set(Array.isArray(data) ? data : []);
                this.loadingPayroll.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل تقرير الرواتب' });
                this.loadingPayroll.set(false);
            }
        });
    }

    getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
        switch (status) {
            case 'Approved': return 'success';
            case 'Pending': return 'warn';
            case 'Rejected': return 'danger';
            case 'Cancelled': return 'secondary';
            default: return 'info';
        }
    }

    exportToExcel(type: 'transactions' | 'payroll') {
        this.messageService.add({ severity: 'info', summary: 'تصدير', detail: 'جاري تحضير ملف الإكسل...' });
    }
}
