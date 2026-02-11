import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.models';

@Component({
    selector: 'app-loan-requests',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule],
    providers: [MessageService],
    templateUrl: './loan-requests.component.html'
})
export class LoanRequestsComponent implements OnInit {
    loanService = inject(LoanService);
    messageService = inject(MessageService);

    loans = signal<Loan[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.loading.set(true);
        this.loanService.getLoans('PENDING').subscribe({
            next: (res) => {
                if (res.succeeded) this.loans.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    approve(loanId: number) {
        this.loanService.updateLoanStatus({ loanId, status: 'ACTIVE' }).subscribe(res => {
            if (res.succeeded) {
                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم اعتماد القرض' });
                this.loadRequests();
            }
        });
    }

    reject(loanId: number) {
        this.loanService.updateLoanStatus({ loanId, status: 'REJECTED' }).subscribe(res => {
            if (res.succeeded) {
                this.messageService.add({ severity: 'warn', summary: 'تنبيه', detail: 'تم رفض القرض' });
                this.loadRequests();
            }
        });
    }
}
