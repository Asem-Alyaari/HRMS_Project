import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeaveService } from '../../services/leave.service';
import { SetupService } from '../../../setup/services/setup.service';
import { EmployeeService } from '../../../personnel/services/employee.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-leave-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule,
        SelectModule
    ],
    templateUrl: './leave-form.component.html',
    styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent implements OnInit {
    fb = inject(FormBuilder);
    ref = inject(DynamicDialogRef);
    leaveService = inject(LeaveService);
    setupService = inject(SetupService);
    employeeService = inject(EmployeeService);
    messageService = inject(MessageService);

    form!: FormGroup;
    loading = false;

    leaveTypes = signal<any[]>([]);
    employees = signal<any[]>([]);

    ngOnInit() {
        this.initForm();
        this.loadLookups();
    }

    initForm() {
        this.form = this.fb.group({
            employeeId: [null, [Validators.required]],
            leaveTypeId: [null, [Validators.required]],
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required]],
            reason: ['', [Validators.required, Validators.minLength(5)]]
        });
    }

    loadLookups() {
        // Load Leave Types from LeaveConfiguration endpoint
        this.setupService.getAll<any>('LeaveConfiguration/leave-types').subscribe({
            next: (res: any) => {
                // Backend returns Result<List<LeaveTypeDto>>
                const list = res?.data || res || [];
                console.log('Leave Types loaded:', list);
                this.leaveTypes.set(list);
            },
            error: (err) => {
                console.error('Error loading leave types:', err);
                this.leaveTypes.set([]);
            }
        });

        // Load Employees
        this.employeeService.getAll(1, 100).subscribe({
            next: (res: any) => {
                const list = res?.data?.items || res?.items || res?.data || res || [];
                this.employees.set(list);
            },
            error: (err) => {
                console.error('Error loading employees:', err);
                this.employees.set([]);
            }
        });
    }

    onSubmit() {
        if (this.form.invalid) return;

        this.loading = true;
        const val = this.form.value;

        // Format dates to ISO string for backend
        const payload = {
            ...val,
            startDate: val.startDate.toISOString(),
            endDate: val.endDate.toISOString()
        };

        this.leaveService.create(payload).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'تم التقديم', detail: 'تم إرسال طلب الإجازة بنجاح' });
                this.ref.close(true);
            },
            error: () => this.loading = false
        });
    }

    onCancel() {
        this.ref.close(false);
    }
}
