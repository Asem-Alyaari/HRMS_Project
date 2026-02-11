import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { LeaveApprovalsService } from '../../services/leave-approvals.service';
import { LeaveRequest } from '../../models/leave.models';
import { ApprovalStats, BulkApproveResult } from '../../models/leave-approvals.models';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-leave-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        CardModule,
        ToastModule,
        TagModule,
        CheckboxModule,
        TooltipModule,
        FormsModule
    ],
    providers: [MessageService],
    templateUrl: './leave-dashboard.component.html',
    styleUrls: ['./leave-dashboard.component.scss']
})
export class LeaveDashboardComponent implements OnInit {
    approvalsService = inject(LeaveApprovalsService);
    messageService = inject(MessageService);

    stats = signal<ApprovalStats | null>(null);
    delayedRequests = signal<LeaveRequest[]>([]);
    pendingRequests = signal<LeaveRequest[]>([]); // For bulk approval
    selectedRequests = signal<LeaveRequest[]>([]);
    loading = signal(true);
    bulkProcessing = signal(false);

    ngOnInit() {
        this.loadAllData();
    }

    loadAllData() {
        this.loading.set(true);
        // Load Stats
        this.approvalsService.getStats().subscribe({
            next: (res) => {
                const data = (res as any)?.data || res;
                this.stats.set(data);
            }
        });

        // Load Delayed
        this.approvalsService.getDelayed().subscribe({
            next: (res) => {
                const data = (res as any)?.data || res || [];
                this.delayedRequests.set(Array.isArray(data) ? data : []);
            }
        });

        // Load all pending for bulk ( reusing common logic or service )
        // Note: I will fetch pending from LeaveService or similar if needed, 
        // but for now let's assume we show delayed as a priority.

        this.loading.set(false);
    }

    processBulkApproval() {
        const ids = this.selectedRequests().map(r => r.requestId);
        if (ids.length === 0) return;

        this.bulkProcessing.set(true);
        this.approvalsService.bulkApprove({ requestIds: ids, approvedById: 1, notes: 'اعتماد جماعي من لوحة التحكم' }).subscribe({
            next: (res: any) => {
                const result = res?.data || res;
                this.messageService.add({
                    severity: 'success',
                    summary: 'اكتملت العملية',
                    detail: `تم اعتماد ${result.successCount} طلبات بنجاح من أصل ${result.totalRequests}`
                });
                this.selectedRequests.set([]);
                this.loadAllData();
                this.bulkProcessing.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تنفيذ الاعتماد الجماعي' });
                this.bulkProcessing.set(false);
            }
        });
    }

    getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
        switch (status) {
            case 'Approved': return 'success';
            case 'Pending': return 'warn';
            case 'Rejected': return 'danger';
            default: return 'info';
        }
    }
}
