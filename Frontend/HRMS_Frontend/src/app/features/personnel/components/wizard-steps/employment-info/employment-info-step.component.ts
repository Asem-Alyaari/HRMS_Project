import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CreateEmployeeDto } from '../../../models/create-employee.dto';
import { LookupService } from '../../../../../core/services/lookup.service';

@Component({
  selector: 'app-employment-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    ButtonModule,
    InputTextModule,
    SelectModule
  ],
  templateUrl: './employment-info-step.component.html',
  styleUrls: ['./employment-info-step.component.scss']
})
export class EmploymentInfoStepComponent implements OnInit {
  @Input() data!: CreateEmployeeDto;
  @Output() dataChange = new EventEmitter<Partial<CreateEmployeeDto>>();
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  private lookupService = inject(LookupService);

  // Load from API
  departments = signal<{ label: string; value: number }[]>([]);
  jobs = signal<{ label: string; value: number }[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadLookupData();
  }

  loadLookupData() {
    this.loading.set(true);

    // Load departments
    this.lookupService.getDepartments().subscribe({
      next: (depts) => {
        this.departments.set(depts);
      },
      error: (err) => console.error('Error loading departments:', err)
    });

    // Load jobs
    this.lookupService.getJobs().subscribe({
      next: (jobsList) => {
        this.jobs.set(jobsList);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading jobs:', err);
        this.loading.set(false);
      }
    });
  }

  onChange() {
    this.dataChange.emit(this.data);
  }

  onPrev() {
    this.prev.emit();
  }

  onNext() {
    if (!this.data.departmentId || !this.data.jobId || !this.data.hireDate) {
      return;
    }
    this.next.emit();
  }
}
