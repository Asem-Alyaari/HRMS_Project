import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AttendanceService } from '../../services/attendance.service';

@Component({
    selector: 'app-attendance-correction-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DatePickerModule, TextareaModule],
    template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 p-2">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-bold">التاريخ</label>
        <p-datepicker formControlName="date" [disabled]="true"></p-datepicker>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-bold">وقت الدخول</label>
          <p-datepicker formControlName="clockIn" [timeOnly]="true"></p-datepicker>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-bold">وقت الخروج</label>
          <p-datepicker formControlName="clockOut" [timeOnly]="true"></p-datepicker>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-bold">سبب التعديل</label>
        <textarea pTextarea formControlName="reason" rows="3"></textarea>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <p-button label="إلغاء" severity="secondary" (onClick)="ref.close()"></p-button>
        <p-button label="حفظ التعديلات" type="submit" [loading]="loading"></p-button>
      </div>
    </form>
  `
})
export class AttendanceCorrectionFormComponent {
    fb = inject(FormBuilder);
    attendanceService = inject(AttendanceService);
    config = inject(DynamicDialogConfig);
    ref = inject(DynamicDialogRef);

    form: FormGroup;
    loading = false;

    constructor() {
        const data = this.config.data;
        this.form = this.fb.group({
            employeeId: [data.employeeId, Validators.required],
            date: [new Date(data.date), Validators.required],
            clockIn: [data.clockIn ? new Date(data.clockIn) : null],
            clockOut: [data.clockOut ? new Date(data.clockOut) : null],
            reason: ['', Validators.required]
        });
    }

    submit() {
        if (this.form.invalid) return;
        this.loading = true;

        // Format dates to string for API
        const val = this.form.value;
        const request = {
            ...val,
            date: val.date.toISOString().split('T')[0],
            clockIn: val.clockIn?.toISOString(),
            clockOut: val.clockOut?.toISOString()
        };

        this.attendanceService.manualCorrection(request).subscribe({
            next: () => {
                this.ref.close(true);
            },
            error: () => this.loading = false
        });
    }
}
