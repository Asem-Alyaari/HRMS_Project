import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { LookupService } from '../../../../../core/services/lookup.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CreateEmployeeDto } from '../../../models/create-employee.dto';

@Component({
  selector: 'app-financial-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './financial-info-step.component.html',
  styleUrls: ['./financial-info-step.component.scss']
})
export class FinancialInfoStepComponent implements OnInit {
  @Input() data!: CreateEmployeeDto;
  @Output() dataChange = new EventEmitter<Partial<CreateEmployeeDto>>();
  @Output() prev = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  private lookupService = inject(LookupService);

  // Use signal for banks
  banks = signal<{ label: string; value: number }[]>([]);

  ngOnInit() {
    this.loadBanks();
  }

  loadBanks() {
    this.lookupService.getBanks().subscribe({
      next: (data) => {
        this.banks.set(data);
      },
      error: (err) => console.error('Error loading banks:', err)
    });
  }

  onChange() {
    this.dataChange.emit(this.data);
  }

  get totalSalary(): number {
    return (this.data.basicSalary || 0) +
      (this.data.housingAllowance || 0) +
      (this.data.transportAllowance || 0) +
      (this.data.medicalAllowance || 0);
  }

  onPrev() {
    this.prev.emit();
  }

  onSubmit() {
    if (!this.data.basicSalary) {
      return;
    }
    this.submit.emit();
  }
}
