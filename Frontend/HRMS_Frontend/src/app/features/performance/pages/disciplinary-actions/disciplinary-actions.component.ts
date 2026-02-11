import { Component, OnInit, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PerformanceService } from '../../services/performance.service';
import { DisciplinaryAction } from '../../models/performance.models';

@Component({
    selector: 'app-disciplinary-actions',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, CheckboxModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './disciplinary-actions.component.html'
})
export class DisciplinaryActionsComponent implements OnInit {
    performanceService = inject(PerformanceService);
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);

    actions = signal<DisciplinaryAction[]>([]);
    loading = signal(false);
    displayDialog = model(false);
    submitted = signal(false);

    newAction: Partial<DisciplinaryAction> = {
        actionNameAr: '',
        deductionDays: 0,
        isTermination: false
    };

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.performanceService.getDisciplinaryActions().subscribe({
            next: (res) => {
                if (res.succeeded) this.actions.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    openNew() {
        this.newAction = { actionNameAr: '', deductionDays: 0, isTermination: false };
        this.submitted.set(false);
        this.displayDialog.set(true);
    }

    editAction(item: DisciplinaryAction) {
        this.newAction = { ...item };
        this.submitted.set(false);
        this.displayDialog.set(true);
    }

    save() {
        this.submitted.set(true);
        if (this.newAction.actionNameAr) {
            if (this.newAction.actionId) {
                // Update
                this.performanceService.updateDisciplinaryAction(this.newAction.actionId, this.newAction).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث الإجراء' });
                            this.displayDialog.set(false);
                            this.loadData();
                        }
                    }
                });
            } else {
                // Create
                this.performanceService.createDisciplinaryAction(this.newAction).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم حفظ الإجراء' });
                            this.displayDialog.set(false);
                            this.loadData();
                        }
                    }
                });
            }
        }
    }

    deleteAction(id: number) {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من حذف هذا الإجراء؟',
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم، احذف',
            rejectLabel: 'إلغاء',
            accept: () => {
                this.performanceService.deleteDisciplinaryAction(id).subscribe({
                    next: (res) => {
                        if (res.succeeded) {
                            this.messageService.add({ severity: 'warn', summary: 'حذف', detail: 'تم حذف الإجراء' });
                            this.loadData();
                        }
                    }
                });
            }
        });
    }
}
