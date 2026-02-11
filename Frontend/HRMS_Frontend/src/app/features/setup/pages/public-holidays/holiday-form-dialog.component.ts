import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeaveConfigurationService } from '../../../leaves/services/leave-configuration.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-holiday-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    CheckboxModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" dir="rtl" class="flex flex-col gap-4 mt-4">
      <div class="flex flex-col gap-1">
        <label for="nameAr" class="text-sm font-medium text-slate-700 dark:text-zinc-300">اسم العطلة (عربي)</label>
        <input pInputText id="nameAr" formControlName="holidayNameAr" class="w-full" placeholder="مثال: عيد الفطر">
      </div>

      <div class="flex flex-col gap-1">
        <label for="nameEn" class="text-sm font-medium text-slate-700 dark:text-zinc-300">اسم العطلة (إنجليزي)</label>
        <input pInputText id="nameEn" formControlName="holidayNameEn" class="w-full" placeholder="Example: Eid Al-Fitr">
      </div>

      <div class="flex flex-col gap-1">
        <label for="date" class="text-sm font-medium text-slate-700 dark:text-zinc-300">التاريخ</label>
        <p-datepicker id="date" formControlName="holidayDate" [showIcon]="true" appendTo="body" styleClass="w-full" [dir]="'rtl'"></p-datepicker>
      </div>

      <div class="flex items-center gap-2 mt-2">
        <p-checkbox formControlName="isRecurring" [binary]="true" id="recurring"></p-checkbox>
        <label for="recurring" class="text-sm font-medium text-slate-700 dark:text-zinc-300">تتكرر سنوياً في نفس اليوم والشهر</label>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button pButton type="button" label="إلغاء" class="p-button-text p-button-secondary" (click)="onCancel()"></button>
        <button pButton type="submit" label="حفظ" class="p-button-warning" [loading]="submitting"></button>
      </div>
    </form>
  `
})
export class HolidayFormDialogComponent {
  fb = inject(FormBuilder);
  leaveConfigService = inject(LeaveConfigurationService);
  ref = inject(DynamicDialogRef);
  messageService = inject(MessageService);

  submitting = false;

  form = this.fb.group({
    holidayNameAr: ['', Validators.required],
    holidayNameEn: ['', Validators.required],
    holidayDate: [null as Date | null, Validators.required],
    isRecurring: [false]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    const val = this.form.value;

    // Formatting date to ISO string for backend
    const apiData = {
      holidayNameAr: val.holidayNameAr!,
      holidayNameEn: val.holidayNameEn!,
      holidayDate: val.holidayDate!.toISOString(),
      isRecurring: !!val.isRecurring
    };

    this.leaveConfigService.createPublicHoliday(apiData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تمت إضافة العطلة بنجاح' });
        this.ref.close(true);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إضافة العطلة' });
        this.submitting = false;
      }
    });
  }

  onCancel() {
    this.ref.close();
  }
}
