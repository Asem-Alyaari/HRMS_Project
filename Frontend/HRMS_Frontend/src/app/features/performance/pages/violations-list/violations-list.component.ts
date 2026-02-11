import { Component, OnInit, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PerformanceService } from '../../services/performance.service';
import { EmployeeService } from '../../../personnel/services/employee.service';
import { Violation, ViolationType } from '../../models/performance.models';
import { Employee } from '../../../personnel/models/employee.model';

@Component({
    selector: 'app-violations-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule,
        SelectModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './violations-list.component.html',
    styleUrls: ['./violations-list.component.scss']
})
export class ViolationsListComponent implements OnInit {
    performanceService = inject(PerformanceService);
    employeeService = inject(EmployeeService);
    messageService = inject(MessageService);

    violations = signal<Violation[]>([]);
    violationTypes = signal<ViolationType[]>([]);
    employees = signal<Employee[]>([]);

    loading = signal(true);
    violationDialog = model(false);
    submitted = signal(false);

    newViolation: any = {
        employeeId: null,
        violationTypeId: null,
        dateOfViolation: new Date(),
        description: '',
        notes: ''
    };

    ngOnInit() {
        this.loadData();
        this.loadLookups();
    }

    loadData() {
        this.loading.set(true);
        this.performanceService.getViolations().subscribe({
            next: (res) => {
                if (res.succeeded) {
                    this.violations.set(res.data);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    loadLookups() {
        this.performanceService.getViolationTypes().subscribe(res => {
            if (res.succeeded) this.violationTypes.set(res.data);
        });

        // Load simple list of employees
        this.employeeService.getAll(1, 100).subscribe(res => {
            const list = res?.data?.items || res?.items || res?.data || res || [];
            this.employees.set(list);
        });
    }

    openNew() {
        this.newViolation = {
            employeeId: null,
            violationTypeId: null,
            dateOfViolation: new Date(),
            description: '',
            notes: ''
        };
        this.submitted.set(false);
        this.violationDialog.set(true);
    }

    saveViolation() {
        this.submitted.set(true);

        if (this.newViolation.employeeId && this.newViolation.violationTypeId && this.newViolation.description) {

            const command = {
                employeeId: this.newViolation.employeeId,
                violationTypeId: this.newViolation.violationTypeId,
                dateOfViolation: this.newViolation.dateOfViolation.toISOString(), // Ensure ISO string
                description: this.newViolation.description,
                notes: this.newViolation.notes
            };

            this.performanceService.registerViolation(command).subscribe({
                next: (res) => {
                    if (res.succeeded) {
                        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل المخالفة بنجاح' });
                        this.violationDialog.set(false);
                        this.loadData();
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: res.message });
                    }
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء الاتصال بالخادم' });
                }
            });
        }
    }

    hideDialog() {
        this.violationDialog.set(false);
        this.submitted.set(false);
    }
}
