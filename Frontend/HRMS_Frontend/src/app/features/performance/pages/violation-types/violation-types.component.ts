import { Component, OnInit, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PerformanceService } from '../../services/performance.service';
import { ViolationType } from '../../models/performance.models';

@Component({
    selector: 'app-violation-types',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './violation-types.component.html'
})
export class ViolationTypesComponent implements OnInit {
    performanceService = inject(PerformanceService);
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);

    violationTypes = signal<ViolationType[]>([]);
    loading = signal(false);
    displayDialog = model(false);
    submitted = signal(false);

    severityOptions = [
        { label: '1 - شديدة الخطورة (الأكثر خطورة)', value: 1 },
        { label: '2 - عالية الخطورة', value: 2 },
        { label: '3 - متوسطة الخطورة', value: 3 },
        { label: '4 - قليلة الخطورة', value: 4 },
        { label: '5 - منخفضة الخطورة (الأقل خطورة)', value: 5 }
    ];

    newType: Partial<ViolationType> = {
        violationNameAr: '',
        severityLevel: 5
    };

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.performanceService.getViolationTypes().subscribe({
            next: (res) => {
                if (res.succeeded && res.data) {
                    // Normalization: Ensure properties are correctly cased for the frontend
                    const normalizedData = res.data.map((item: any) => ({
                        violationTypeId: item.violationTypeId ?? item.ViolationTypeId,
                        violationNameAr: item.violationNameAr ?? item.ViolationNameAr,
                        severityLevel: item.severityLevel ?? item.SeverityLevel
                    }));
                    this.violationTypes.set(normalizedData);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getSeverityLabel(level: any): string {
        if (level === undefined || level === null) return '';
        const numericLevel = Number(level);
        const option = this.severityOptions.find(o => o.value === numericLevel);
        return option ? option.label : `مستوى ${level}`;
    }

    openNew() {
        this.newType = { violationNameAr: '', severityLevel: 5 };
        this.submitted.set(false);
        this.displayDialog.set(true);
    }

    editType(item: ViolationType) {
        this.newType = { ...item };
        this.submitted.set(false);
        this.displayDialog.set(true);
    }

    save() {
        this.submitted.set(true);
        if (this.newType.violationNameAr) {
            if (this.newType.violationTypeId) {
                // Update
                this.performanceService.updateViolationType(this.newType.violationTypeId, this.newType).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث نوع المخالفة' });
                            this.displayDialog.set(false);
                            this.loadData();
                        }
                    }
                });
            } else {
                // Create
                this.performanceService.createViolationType(this.newType).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم حفظ نوع المخالفة' });
                            this.displayDialog.set(false);
                            this.loadData();
                        }
                    }
                });
            }
        }
    }

    deleteType(id: number) {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من حذف نوع المخالفة؟ لا يمكن التراجع عن هذا الإجراء.',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم، احذف',
            rejectLabel: 'إلغاء',
            accept: () => {
                this.performanceService.deleteViolationType(id).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'warn', summary: 'حذف', detail: 'تم حذف النوع' });
                            this.loadData();
                        }
                    }
                });
            }
        });
    }
}
