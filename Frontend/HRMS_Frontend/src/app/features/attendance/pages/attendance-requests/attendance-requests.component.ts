import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../../personnel/services/employee.service';

@Component({
    selector: 'app-attendance-requests',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        TabsModule,
        ButtonModule,
        InputTextModule,
        DatePickerModule,
        TextareaModule,
        SelectModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './attendance-requests.component.html',
    styleUrls: ['./attendance-requests.component.scss']
})
export class AttendanceRequestsComponent implements OnInit {
    fb = inject(FormBuilder);
    attendanceService = inject(AttendanceService);
    employeeService = inject(EmployeeService);
    messageService = inject(MessageService);

    overtimeForm: FormGroup;
    swapForm: FormGroup;
    permissionForm: FormGroup;

    employees = signal<any[]>([]);
    loading = signal(false);

    constructor() {
        this.overtimeForm = this.fb.group({
            date: [new Date(), Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            reason: ['', Validators.required]
        });

        this.swapForm = this.fb.group({
            requestDate: [new Date(), Validators.required],
            targetEmployeeId: [null, Validators.required],
            targetDate: [new Date(), Validators.required],
            reason: ['', Validators.required]
        });

        this.permissionForm = this.fb.group({
            date: [new Date(), Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            type: ['Personal', Validators.required],
            reason: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadEmployees();
    }

    loadEmployees() {
        this.employeeService.getAll(1, 100).subscribe({
            next: (res: any) => {
                this.employees.set(res?.data?.items || res || []);
            }
        });
    }

    submitOvertime() {
        if (this.overtimeForm.invalid) return;
        this.loading.set(true);
        this.attendanceService.applyOvertime(this.overtimeForm.value).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إرسال طلب العمل الإضافي' });
                this.overtimeForm.reset({ date: new Date() });
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    submitSwap() {
        if (this.swapForm.invalid) return;
        this.loading.set(true);
        this.attendanceService.applySwap(this.swapForm.value).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إرسال طلب التبديل' });
                this.swapForm.reset({ requestDate: new Date(), targetDate: new Date() });
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    submitPermission() {
        if (this.permissionForm.invalid) return;
        this.loading.set(true);
        this.attendanceService.applyPermission(this.permissionForm.value).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إرسال طلب الاستئذان' });
                this.permissionForm.reset({ date: new Date(), type: 'Personal' });
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
