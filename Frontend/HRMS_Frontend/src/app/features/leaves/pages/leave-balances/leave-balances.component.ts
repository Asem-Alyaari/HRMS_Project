import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeaveBalanceService } from '../../services/leave-balance.service';
import { LeaveBalanceInfo } from '../../models/leave-balance.models';

@Component({
    selector: 'app-leave-balances',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        ToolbarModule,
        TooltipModule,
        SelectModule
    ],
    providers: [MessageService, DialogService],
    templateUrl: './leave-balances.component.html',
    styleUrls: ['./leave-balances.component.scss']
})
export class LeaveBalancesComponent implements OnInit {
    balanceService = inject(LeaveBalanceService);
    messageService = inject(MessageService);
    dialogService = inject(DialogService);

    balances = signal<any[]>([]); // Using any for joint employee+balance structure
    loading = signal(true);
    currentYear = new Date().getFullYear();
    ref: DynamicDialogRef | undefined;

    searchEmployeeId: number | null = null;

    ngOnInit() {
        this.loadBalances();
    }

    loadBalances() {
        this.loading.set(true);
        // Note: API for "all" balances isn't explicitly defined as a bulk fetch in Controller, 
        // but the user expects a management view. 
        // I will use getEmployeeBalance if ID is provided, or placeholder logic for now.
        if (this.searchEmployeeId) {
            this.balanceService.getEmployeeBalance(this.searchEmployeeId, this.currentYear).subscribe({
                next: (res: any) => {
                    const data = res?.data || res || [];
                    this.balances.set(Array.isArray(data) ? data : []);
                    this.loading.set(false);
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل الأرصدة' });
                    this.loading.set(false);
                }
            });
        } else {
            // Just empty or general loading
            this.balances.set([]);
            this.loading.set(false);
        }
    }

    openInitializeDialog() {
        // To be implemented: Dialog for initializing balances
        this.messageService.add({ severity: 'info', summary: 'تنبيه', detail: 'جاري فتح نافذة تهيئة الأرصدة...' });
    }

    openAdjustDialog(item: any) {
        // To be implemented: Dialog for manual adjustment
        this.messageService.add({ severity: 'info', summary: 'تنبيه', detail: 'جاري فتح نافذة تعديل الرصيد...' });
    }
}
