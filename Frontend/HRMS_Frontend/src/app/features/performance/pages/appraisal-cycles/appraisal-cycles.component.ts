import { Component, OnInit, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PerformanceService } from '../../services/performance.service';
import { AppraisalCycle } from '../../models/performance.models';

@Component({
    selector: 'app-appraisal-cycles',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, DatePickerModule, SelectModule, TagModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './appraisal-cycles.component.html'
})
export class AppraisalCyclesComponent implements OnInit {
    performanceService = inject(PerformanceService);
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);

    cycles = signal<AppraisalCycle[]>([]);
    loading = signal(false);
    displayDialog = model(false);
    submitted = signal(false);

    statuses = [
        { label: 'مخطط', value: 'Planned' },
        { label: 'نشط', value: 'Active' },
        { label: 'مغلق', value: 'Closed' }
    ];

    newCycle: Partial<AppraisalCycle> = {
        cycleNameAr: '',
        startDate: '',
        endDate: '',
        status: 'Planned'
    };

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.performanceService.getAppraisalCycles().subscribe({
            next: (res) => {
                if (res.succeeded) this.cycles.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    openNew() {
        this.newCycle = {
            cycleNameAr: '',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            status: 'Planned'
        };
        this.submitted.set(false);
        this.displayDialog.set(true);
    }

    editCycle(item: AppraisalCycle) {
        this.newCycle = { ...item };
        this.submitted.set(false);
        this.displayDialog.set(true);
    }

    save() {
        this.submitted.set(true);
        if (this.newCycle.cycleNameAr && this.newCycle.startDate && this.newCycle.endDate) {
            if (this.newCycle.cycleId) {
                // Update
                this.performanceService.updateAppraisalCycle(this.newCycle.cycleId, this.newCycle).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث فترة التقييم' });
                            this.displayDialog.set(false);
                            this.loadData();
                        }
                    }
                });
            } else {
                // Create
                this.performanceService.createAppraisalCycle(this.newCycle).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم حفظ فترة التقييم' });
                            this.displayDialog.set(false);
                            this.loadData();
                        }
                    }
                });
            }
        }
    }

    deleteCycle(id: number) {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع التقييمات المرتبطة بها.',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم، احذف',
            rejectLabel: 'إلغاء',
            accept: () => {
                this.performanceService.deleteAppraisalCycle(id).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'warn', summary: 'حذف', detail: 'تم حذف الدورة' });
                            this.loadData();
                        }
                    }
                });
            }
        });
    }

    getStatusSeverity(status: string) {
        switch (status) {
            case 'Active': return 'success';
            case 'Planned': return 'info';
            case 'Closed': return 'secondary';
            default: return 'info';
        }
    }

    getStatusLabel(status: string) {
        return this.statuses.find(s => s.value === status)?.label || status;
    }
}
