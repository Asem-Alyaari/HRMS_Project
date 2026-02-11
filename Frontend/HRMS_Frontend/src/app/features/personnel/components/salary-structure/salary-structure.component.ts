import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PayrollService } from '../../../payroll/services/payroll.service';
import { EmployeeSalaryStructure } from '../../../payroll/models/payroll.models';

@Component({
  selector: 'app-salary-structure',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputNumberModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="p-4">
      <p-toast></p-toast>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-slate-900 border-r-4 border-blue-600 pr-3">هيكل الراتب للموظف</h3>
        <button pButton label="تحميل من الدرجة الوظيفية" icon="pi pi-sync" 
                class="p-button-outlined p-button-warning" (click)="initializeFromGrade()"></button>
      </div>

      <div *ngIf="loading()" class="flex justify-center p-8">
        <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
      </div>

      <div *ngIf="!loading() && structure()" class="space-y-6">
        <p-table [value]="structure()!.elements" styleClass="p-datatable-sm shadow-sm rounded-xl overflow-hidden">
          <ng-template pTemplate="header">
            <tr>
              <th>العنصر</th>
              <th>النوع</th>
              <th>المبلغ</th>
              <th>النسبة (%)</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td class="font-bold">{{ item.elementNameAr }}</td>
              <td>
                <span [class]="item.elementType === 'EARNING' ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded' : 'text-red-600 bg-red-50 px-2 py-0.5 rounded'">
                  {{ item.elementType === 'EARNING' ? 'استحقاق' : 'استقطاع' }}
                </span>
              </td>
              <td>
                <p-inputNumber [(ngModel)]="item.amount" [min]="0" mode="decimal" [minFractionDigits]="2" [maxFractionDigits]="2"></p-inputNumber>
              </td>
              <td class="text-slate-500">{{ item.percentage }}%</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="footer">
            <tr class="bg-slate-50 font-bold">
              <td colspan="2" class="text-left">الإجمالي:</td>
              <td colspan="2">
                <div class="flex flex-col gap-1">
                  <span class="text-green-600">إجمالي الاستحقاقات: {{ calculateTotal('EARNING') | number }}</span>
                  <span class="text-red-600">إجمالي الاستقطاعات: {{ calculateTotal('DEDUCTION') | number }}</span>
                  <div class="border-t border-slate-300 mt-1 pt-1 text-lg text-blue-800">
                    صافي الراتب: {{ (calculateTotal('EARNING') - calculateTotal('DEDUCTION')) | number }}
                  </div>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>

        <div class="flex justify-end gap-3 mt-6">
          <button pButton label="حفظ التغييرات" icon="pi pi-save" (click)="saveChanges()" [loading]="saving()"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-inputnumber-input {
      width: 120px;
    }
    th {
      background-color: #f8fafc !important;
      color: #64748b !important;
      font-size: 0.8rem;
      text-transform: uppercase;
    }
  `]
})
export class SalaryStructureComponent implements OnInit {
  @Input() employeeId!: number;

  payrollService = inject(PayrollService);
  messageService = inject(MessageService);

  structure = signal<EmployeeSalaryStructure | null>(null);
  loading = signal(true);
  saving = signal(false);

  ngOnInit() {
    this.loadStructure();
  }

  loadStructure() {
    if (!this.employeeId) return;
    this.loading.set(true);
    this.payrollService.getEmployeeStructure(this.employeeId).subscribe({
      next: (res: any) => {
        if (res.succeeded) {
          this.structure.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  calculateTotal(type: string): number {
    const s = this.structure();
    if (!s) return 0;
    return s.elements
      .filter((e: any) => e.elementType === type)
      .reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  }

  saveChanges() {
    const s = this.structure();
    if (!s) return;

    this.saving.set(true);
    this.payrollService.updateStructure(s).subscribe({
      next: (res: any) => {
        if (res.succeeded) {
          this.messageService.add({ severity: 'success', summary: 'تم الحفظ', detail: 'تم تحديث هيكل الراتب بنجاح' });
        }
        this.saving.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حفظ التغييرات' });
        this.saving.set(false);
      }
    });
  }

  initializeFromGrade() {
    if (!this.employeeId) return;
    this.loading.set(true);
    this.payrollService.initializeFromGrade(this.employeeId).subscribe({
      next: (res: any) => {
        if (res.succeeded) {
          this.messageService.add({ severity: 'info', summary: 'تحديث', detail: 'تم تحميل البيانات من الدرجة الوظيفية' });
          this.loadStructure();
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }
}
