import { Component, Input, Output, EventEmitter, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { CreateEmployeeDto } from '../../../models/create-employee.dto';
import { LookupService } from '../../../../../core/services/lookup.service';

@Component({
  selector: 'app-personal-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    InputMaskModule,
    SelectModule
  ],
  templateUrl: './personal-info-step.component.html',
  styleUrls: ['./personal-info-step.component.scss']
})
export class PersonalInfoStepComponent implements OnInit {
  @Input() data!: CreateEmployeeDto;
  @Output() dataChange = new EventEmitter<Partial<CreateEmployeeDto>>();
  @Output() next = new EventEmitter<void>();

  private lookupService = inject(LookupService);

  genders = [
    { label: 'ذكر', value: 'Male' },
    { label: 'أنثى', value: 'Female' }
  ];

  // Load from API
  nationalities = signal<{ label: string; value: number }[]>([]);

  ngOnInit() {
    this.loadNationalities();
  }

  loadNationalities() {
    this.lookupService.getNationalities().subscribe({
      next: (countries) => {
        this.nationalities.set(countries);
      },
      error: (err) => console.error('Error loading nationalities:', err)
    });
  }

  onChange() {
    this.dataChange.emit(this.data);
  }

  onNext() {
    // Validation logic can go here
    if (!this.data.firstNameAr || !this.data.lastNameAr || !this.data.mobile) {
      // Simple validation for now
      return;
    }
    this.next.emit();
  }
}
