import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LeaveService } from '../../services/leave.service';
import { LeaveRequest } from '../../models/leave.models';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeaveFormComponent } from '../leave-form/leave-form.component';

@Component({
    selector: 'app-leave-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        TagModule,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService, DialogService],
    templateUrl: './leave-list.component.html',
    styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
    leaveService = inject(LeaveService);
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);
    dialogService = inject(DialogService);

    requests = signal<LeaveRequest[]>([]);
    loading = signal(true);
    ref: DynamicDialogRef | undefined | null;

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.leaveService.getPendingRequests().subscribe({
            next: (res: any) => {
                console.log('Pending requests response:', res);
                // Handle both Result<T> wrapper and direct response
                const data = res?.data || res || [];
                this.requests.set(Array.isArray(data) ? data : []);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading pending requests:', err);
                this.loading.set(false);
            }
        });
    }

    openNew() {
        this.ref = this.dialogService.open(LeaveFormComponent, {
            header: 'تقديم طلب إجازة جديد',
            width: '50vw',
            contentStyle: { overflow: 'auto' },
            breakpoints: { '960px': '75vw', '640px': '90vw' }
        });

        this.ref?.onClose.subscribe((success: boolean) => {
            if (success) this.loadData();
        });
    }

    approve(request: LeaveRequest) {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من الموافقة على الطلب؟',
            header: 'تأكيد الموافقة',
            icon: 'pi pi-check-circle',
            accept: () => {
                this.leaveService.approve(request.requestId, { requestId: request.requestId }).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'تمت الموافقة', detail: 'تم تحديث حالة الطلب بنجاح' });
                        this.loadData();
                    }
                });
            }
        });
    }

    reject(request: LeaveRequest) {
        this.confirmationService.confirm({
            message: 'هل أنت متأكد من رفض الطلب؟',
            header: 'تأكيد الرفض',
            icon: 'pi pi-times-circle',
            acceptLabel: 'رفض',
            rejectLabel: 'إلغاء',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.leaveService.reject(request.requestId, { requestId: request.requestId, notes: 'تم الرفض من قبل المدير' }).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'info', summary: 'تم الرفض', detail: 'تم رفض طلب الإجازة' });
                        this.loadData();
                    }
                });
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

    getStatusLabel(status: string): string {
        switch (status) {
            case 'Approved': return 'مقبول';
            case 'Pending': return 'قيد الانتظار';
            case 'Rejected': return 'مرفوض';
            case 'Cancelled': return 'ملغى';
            default: return status;
        }
    }
}
