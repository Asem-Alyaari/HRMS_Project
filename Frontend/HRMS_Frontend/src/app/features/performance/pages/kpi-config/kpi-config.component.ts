import { Component, OnInit, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PerformanceService } from '../../services/performance.service';
import { KPI } from '../../models/performance.models';

@Component({
    selector: 'app-kpi-config',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, SelectModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './kpi-config.component.html'
})
export class KpiConfigComponent implements OnInit {
    performanceService = inject(PerformanceService);
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);

    kpis = signal<KPI[]>([]);
    loading = signal(false);
    displayDialog = model(false);
    submitted = signal(false);

    categories = [
        { label: 'إنتاجية', value: 'Productivity' },
        { label: 'سلوك', value: 'Behavior' },
        { label: 'التزام', value: 'Commitment' },
        { label: 'مهارات تقنية', value: 'Technical' }
    ];

    newKpi: Partial<KPI> = {
        kpiNameAr: '',
        category: 'Productivity',
        weight: 10
    };

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.performanceService.getKpis().subscribe({
            next: (res: any) => {
                if (res.succeeded) this.kpis.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    openNew() {
        this.newKpi = { kpiNameAr: '', category: 'Productivity', weight: 10 };
        this.submitted.set(false);
        this.displayDialog.set(true);
    }

    editKpi(item: KPI) {
        this.newKpi = { ...item };
        this.submitted.set(false);
        this.displayDialog.set(true);
    }

    save() {
        this.submitted.set(true);
        if (this.newKpi.kpiNameAr && this.newKpi.weight) {
            if (this.newKpi.kpiId) {
                // Update
                this.performanceService.updateKpi(this.newKpi.kpiId, this.newKpi).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث المؤشر' });
                            this.displayDialog.set(false);
                            this.loadData();
                        }
                    }
                });
            } else {
                // Create
                this.performanceService.createKpi(this.newKpi).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم حفظ المؤشر' });
                            this.displayDialog.set(false);
                            this.loadData();
                        }
                    }
                });
            }
        }
    }

    deleteKpi(id: number) {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من حذف هذا المؤشر؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم، احذف',
            rejectLabel: 'إلغاء',
            accept: () => {
                this.performanceService.deleteKpi(id).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'warn', summary: 'حذف', detail: 'تم حذف المؤشر' });
                            this.loadData();
                        }
                    }
                });
            }
        });
    }
}
