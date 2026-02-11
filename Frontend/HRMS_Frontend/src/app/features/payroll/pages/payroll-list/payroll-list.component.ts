import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PayrollService } from '../../services/payroll.service';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-payroll-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DatePickerModule,
        ToastModule,
        TableModule
    ],
    providers: [MessageService],
    templateUrl: './payroll-list.component.html',
    styleUrls: ['./payroll-list.component.scss']
})
export class PayrollListComponent {
    payrollService = inject(PayrollService);
    messageService = inject(MessageService);

    selectedDate = signal<Date>(new Date());
    loading = signal(false);
    processing = signal(false);

    processPayroll() {
        const month = this.selectedDate().getMonth() + 1;
        const year = this.selectedDate().getFullYear();

        this.processing.set(true);
        this.payrollService.processMonth(month, year).subscribe({
            next: (res) => {
                if (res.succeeded) {
                    this.messageService.add({ severity: 'success', summary: 'تمت العملية', detail: 'تمت معالجة رواتب الشهر بنجاح' });
                }
                this.processing.set(false);
            },
            error: () => this.processing.set(false)
        });
    }

    exportBankFile() {
        const month = this.selectedDate().getMonth() + 1;
        const year = this.selectedDate().getFullYear();

        this.payrollService.exportBankFile(month, year).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Bank_Transfer_${month}_${year}.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تصدير ملف البنك' })
        });
    }
}
