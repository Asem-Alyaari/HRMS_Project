import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SetupService } from '../../services/setup.service';
import { CreateDocumentTypeCommand, DocumentType } from '../../models/setup.models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-document-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    InputNumberModule
  ],
  templateUrl: './document-type-form.component.html',
  styleUrls: ['./document-type-form.component.scss']
})
export class DocumentTypeFormComponent implements OnInit {
  fb = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  setupService = inject(SetupService);
  messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  isEditMode = false;
  loading = false;

  ngOnInit() {
    this.initForm();
    if (this.config.data && this.config.data.documentTypeId) {
      this.isEditMode = true;
      this.form.patchValue(this.config.data);
    }
  }

  initForm() {
    this.form = this.fb.group({
      documentTypeId: [null],
      documentTypeNameAr: ['', [Validators.required]],
      documentTypeNameEn: ['', [Validators.required]],
      description: [''],
      allowedExtensions: [''],
      isRequired: [false],
      hasExpiry: [false],
      defaultExpiryDays: [null],
      maxFileSizeMB: [null]
    });

    // Optional: Add conditional validation or logic here
    // e.g. if hasExpiry is true, maybe defaultExpiryDays should be validated? 
    // Backend allows nulls, so Frontend can too unless strict requirement.

    // Conditional validation for expiry days
    this.form.get('hasExpiry')?.valueChanges.subscribe(val => {
      const expDays = this.form.get('defaultExpiryDays');
      if (val) {
        expDays?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        expDays?.clearValidators();
        expDays?.setValue(null);
      }
      expDays?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const formData = { ...this.form.value };

    if (this.isEditMode) {
      this.setupService.update('DocumentTypes', formData.documentTypeId, formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم التعديل بنجاح' });
          this.ref.close(true);
          this.loading = false;
        },
        error: (err) => this.handleError(err)
      });
    } else {
      // Remove ID for create
      delete formData.documentTypeId;

      this.setupService.create('DocumentTypes', formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم الإضافة بنجاح' });
          this.ref.close(true);
          this.loading = false;
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any) {
    this.loading = false;
    console.error('Setup Error:', err);

    let detail = 'حدث خطأ أثناء حفظ البيانات';
    if (err.error) {
      if (typeof err.error === 'string') {
        detail = err.error;
      } else if (err.error.message) {
        detail = err.error.message;
      }

      if (err.error.errors && Array.isArray(err.error.errors)) {
        detail = err.error.errors.join(' - ');
      } else if (err.error.errors && typeof err.error.errors === 'object') {
        // Handle ASP.NET Validation errors object
        detail = Object.values(err.error.errors).flat().join(' - ');
      }
    }

    this.messageService.add({
      severity: 'error',
      summary: 'خطأ في الحفظ',
      detail: detail,
      life: 5000
    });

    this.cdr.detectChanges();
  }

  onCancel() {
    this.ref.close(false);
  }
}
