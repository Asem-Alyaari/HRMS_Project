import { Component, OnInit, signal, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoanService } from '../../services/loan.service';
import { EmployeeService } from '../../../personnel/services/employee.service';
import { Loan, LoanInstallment, CreateLoanCommand } from '../../models/loan.models';
import { Employee } from '../../../personnel/models/employee.model';

@Component({
    selector: 'app-loans-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputNumberModule,
        InputTextModule,
        DatePickerModule,
        SelectModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './loans-list.component.html',
    styleUrls: ['./loans-list.component.scss']
})
export class LoansListComponent implements OnInit {
    loanService = inject(LoanService);
    employeeService = inject(EmployeeService);
    messageService = inject(MessageService);

    installments = signal<LoanInstallment[]>([]);
    employees = signal<Employee[]>([]);
    loading = signal(false);
    loanDialog = model(false);
    submitted = signal(false);

    selectedDate = signal(new Date());

    newLoan: CreateLoanCommand = {
        employeeId: 0,
        loanAmount: 0,
        installmentCount: 12,
        startDate: new Date().toISOString(),
        reason: ''
    };

    ngOnInit() {
        this.loadInstallments();
        this.loadEmployees();
    }

    loadInstallments() {
        this.loading.set(true);
        const date = this.selectedDate();
        this.loanService.getMonthlyInstallments(date.getMonth() + 1, date.getFullYear()).subscribe({
            next: (res) => {
                if (res.succeeded) {
                    this.installments.set(res.data);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadEmployees() {
        this.employeeService.getAll(1, 100).subscribe(res => {
            const list = res?.data?.items || res?.items || res?.data || res || [];
            this.employees.set(list);
        });
    }

    openNew() {
        this.newLoan = {
            employeeId: 0,
            loanAmount: 1000,
            installmentCount: 12,
            startDate: new Date().toISOString(),
            reason: ''
        };
        this.submitted.set(false);
        this.loanDialog.set(true);
    }

    saveLoan() {
        this.submitted.set(true);
        if (this.newLoan.employeeId && this.newLoan.loanAmount > 0) {
            // Ensure date is properly formatted
            const command = { ...this.newLoan };
            if ((command.startDate as any) instanceof Date) {
                command.startDate = (command.startDate as any as Date).toISOString();
            }

            this.loanService.createLoan(command).subscribe({
                next: (res) => {
                    if (res.succeeded) {
                        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إنشاء القرض بنجاح' });
                        this.loanDialog.set(false);
                        this.loadInstallments();
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: res.message });
                    }
                },
                error: (err) => {
                    console.error('Error creating loan:', err);
                    let detail = 'حدث خطأ أثناء حفظ البيانات';
                    if (err.error && err.error.message) {
                        detail = err.error.message;
                    } else if (err.error && err.error.errors) {
                        detail = Object.values(err.error.errors).flat().join(' - ');
                    }
                    this.messageService.add({ severity: 'error', summary: 'خطأ في الطلب', detail: detail });
                }
            });
        }
    }

    hideDialog() {
        this.loanDialog.set(false);
    }
}
