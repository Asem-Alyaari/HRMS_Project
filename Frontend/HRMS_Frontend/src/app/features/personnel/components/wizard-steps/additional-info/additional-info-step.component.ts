import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Checkbox } from 'primeng/checkbox';
import { CreateEmployeeDto } from '../../../models/create-employee.dto';
import { LookupService } from '../../../../../core/services/lookup.service';
import { Qualification, Experience, Certification } from '../../../models/sub-models';

@Component({
    selector: 'app-additional-info-step',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        DatePickerModule,
        SelectModule,
        TableModule,
        DialogModule,
        Checkbox
    ],
    templateUrl: './additional-info-step.component.html'
})
export class AdditionalInfoStepComponent {
    @Input() data!: CreateEmployeeDto;
    @Output() dataChange = new EventEmitter<CreateEmployeeDto>();
    @Output() prev = new EventEmitter<void>();
    @Output() submit = new EventEmitter<void>();

    private lookupService = inject(LookupService);
    countries = signal<{ label: string; value: number }[]>([]);

    // Dialog Visibility
    showQualDialog = false;
    showExpDialog = false;
    showCertDialog = false;

    // Temporary Form Objects
    tempQual: Qualification = { degreeType: '', majorAr: '', universityAr: '', countryId: 0, graduationYear: new Date().getFullYear(), grade: '' };
    tempExp: Experience = { companyNameAr: '', jobTitleAr: '', startDate: '', isCurrent: false };
    tempCert: Certification = { certificationName: '', issuingOrganization: '', issueDate: '' };

    constructor() {
        this.lookupService.getNationalities().subscribe(data => this.countries.set(data));
    }

    addQualification() {
        this.data.qualifications.push({ ...this.tempQual });
        this.showQualDialog = false;
        this.tempQual = { degreeType: '', majorAr: '', universityAr: '', countryId: 0, graduationYear: new Date().getFullYear(), grade: '' };
        this.dataChange.emit(this.data);
    }

    removeQual(index: number) {
        this.data.qualifications.splice(index, 1);
        this.dataChange.emit(this.data);
    }

    addExperience() {
        this.data.experiences.push({ ...this.tempExp });
        this.showExpDialog = false;
        this.tempExp = { companyNameAr: '', jobTitleAr: '', startDate: '', isCurrent: false };
        this.dataChange.emit(this.data);
    }

    removeExp(index: number) {
        this.data.experiences.splice(index, 1);
        this.dataChange.emit(this.data);
    }

    addCertification() {
        this.data.certifications.push({ ...this.tempCert });
        this.showCertDialog = false;
        this.tempCert = { certificationName: '', issuingOrganization: '', issueDate: '' };
        this.dataChange.emit(this.data);
    }

    removeCert(index: number) {
        this.data.certifications.splice(index, 1);
        this.dataChange.emit(this.data);
    }

    onPrev() { this.prev.emit(); }
    onSubmit() { this.submit.emit(); }
}
