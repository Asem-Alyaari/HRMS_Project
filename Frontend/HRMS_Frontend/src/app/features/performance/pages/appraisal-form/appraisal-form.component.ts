import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { PerformanceService } from '../../services/performance.service';
import { EmployeeService } from '../../../personnel/services/employee.service';
import { KPI, AppraisalCycle, SubmitAppraisalCommand, AppraisalDetail } from '../../models/performance.models';
import { Employee } from '../../../personnel/models/employee.model';

@Component({
    selector: 'app-appraisal-form',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule, ToastModule],
    providers: [MessageService],
    templateUrl: './appraisal-form.component.html'
})
export class AppraisalFormComponent implements OnInit {
    performanceService = inject(PerformanceService);
    employeeService = inject(EmployeeService);
    messageService = inject(MessageService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    employees = signal<Employee[]>([]);
    cycles = signal<AppraisalCycle[]>([]);
    kpis = signal<KPI[]>([]);
    loading = signal(false);

    selectedEmployeeId = signal<number | null>(null);
    selectedCycleId = signal<number | null>(null);
    appraisalDetails = signal<AppraisalDetail[]>([]);

    ngOnInit() {
        this.loadInitialData();
        const empId = this.route.snapshot.queryParamMap.get('employeeId');
        if (empId) this.selectedEmployeeId.set(Number(empId));
    }

    loadInitialData() {
        this.loading.set(true);
        // Load active cycles
        this.performanceService.getAppraisalCycles().subscribe(res => {
            if (res.succeeded) {
                this.cycles.set(res.data.filter(c => c.status === 'Active'));
            }
        });

        // Load employees
        this.employeeService.getAll(1, 200).subscribe(res => {
            const list = res?.data?.items || res?.items || res?.data || res || [];
            this.employees.set(list);
        });

        // Load KPIs to build the form
        this.performanceService.getKpis().subscribe(res => {
            if (res.succeeded) {
                this.kpis.set(res.data);
                this.appraisalDetails.set(res.data.map(k => ({
                    kpiId: k.kpiId,
                    kpiNameAr: k.kpiNameAr,
                    score: 0,
                    comments: ''
                })));
            }
            this.loading.set(false);
        });
    }

    calculateTotalScore(): number {
        return this.appraisalDetails().reduce((acc, curr) => acc + (curr.score || 0), 0);
    }

    submit() {
        if (!this.selectedEmployeeId() || !this.selectedCycleId()) {
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'يرجى اختيار الموظف وفترة التقييم' });
            return;
        }

        const command: SubmitAppraisalCommand = {
            employeeId: this.selectedEmployeeId()!,
            cycleId: this.selectedCycleId()!,
            appraisalDate: new Date().toISOString(),
            details: this.appraisalDetails()
        };

        this.loading.set(true);
        this.performanceService.submitAppraisal(command).subscribe({
            next: (res) => {
                if (res.succeeded) {
                    this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تقديم التقييم بنجاح' });
                    setTimeout(() => this.router.navigate(['/performance/violations']), 1500);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
