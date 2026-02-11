import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { EmployeeService } from '../../services/employee.service';
import { LookupService } from '../../../../core/services/lookup.service';
import { EmployeeProfile } from '../../models/employee-profile.model';
import { Tooltip } from "primeng/tooltip";
import { SalaryStructureComponent } from '../../components/salary-structure/salary-structure.component';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    TabsModule,
    DividerModule,
    AvatarModule,
    TagModule,
    SkeletonModule,
    CardModule,
    DialogModule,
    ToastModule,
    FileUploadModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    TextareaModule,
    Tooltip,
    SalaryStructureComponent
  ],
  providers: [MessageService],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private lookupService = inject(LookupService);
  private messageService = inject(MessageService);

  employeeId = signal<number>(0);
  employee = signal<EmployeeProfile | null>(null);
  loading = signal<boolean>(true);

  // Lookups
  countries = signal<{ label: string; value: number }[]>([]);
  documentTypes = signal<{ label: string; value: number }[]>([]);

  // Dialog Visibility
  showQualDialog = signal(false);
  showExpDialog = signal(false);
  showCertDialog = signal(false);
  showDocDialog = signal(false);

  // Form State
  saving = signal(false);
  selectedFile: File | null = null;

  qualificationForm = signal<any>({
    degreeType: '',
    majorAr: '',
    universityAr: '',
    countryId: null,
    graduationYear: new Date().getFullYear(),
    grade: ''
  });

  experienceForm = signal<any>({
    companyNameAr: '',
    jobTitleAr: '',
    startDate: null,
    endDate: null,
    isCurrent: false,
    responsibilities: '',
    reasonForLeaving: ''
  });

  certificationForm = signal<any>({
    certificationName: '',
    issuingOrganization: '',
    issueDate: null,
    expiryDate: null,
    credentialId: '',
    credentialUrl: ''
  });

  documentForm = signal<any>({
    documentTypeId: null,
    documentNumber: '',
    expiryDate: null
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.employeeId.set(+id);
        this.loadProfile(+id);
        this.loadLookups();
      }
    });
  }

  loadProfile(id: number) {
    this.loading.set(true);
    this.employeeService.getFullProfile(id).subscribe({
      next: (data) => {
        this.employee.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  loadLookups() {
    this.lookupService.getNationalities().subscribe(data => this.countries.set(data));
    this.lookupService.getDocumentTypes().subscribe(data => this.documentTypes.set(data));
  }

  // --- Handlers ---

  openAddQual() {
    this.qualificationForm.set({
      degreeType: '', majorAr: '', universityAr: '',
      countryId: null, graduationYear: new Date().getFullYear(), grade: ''
    });
    this.selectedFile = null;
    this.showQualDialog.set(true);
  }

  openAddExp() {
    this.experienceForm.set({
      companyNameAr: '', jobTitleAr: '', startDate: null,
      endDate: null, isCurrent: false, responsibilities: '', reasonForLeaving: ''
    });
    this.showExpDialog.set(true);
  }

  openAddCert() {
    this.certificationForm.set({
      certificationName: '', issuingOrganization: '', issueDate: null,
      expiryDate: null, credentialId: '', credentialUrl: ''
    });
    this.selectedFile = null;
    this.showCertDialog.set(true);
  }

  openAddDoc() {
    this.documentForm.set({ documentTypeId: null, documentNumber: '', expiryDate: null });
    this.selectedFile = null;
    this.showDocDialog.set(true);
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  saveQualification() {
    if (!this.qualificationForm().degreeType || !this.qualificationForm().majorAr) {
      this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'يرجى إكمال البيانات المطلوبة' });
      return;
    }
    this.saving.set(true);
    this.employeeService.addQualification(this.employeeId(), this.qualificationForm(), this.selectedFile!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم إضافة المؤهل بنجاح' });
        this.showQualDialog.set(false);
        this.loadProfile(this.employeeId());
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  saveExperience() {
    this.saving.set(true);
    this.employeeService.addExperience(this.employeeId(), this.experienceForm()).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم إضافة الخبرة بنجاح' });
        this.showExpDialog.set(false);
        this.loadProfile(this.employeeId());
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  saveCertification() {
    this.saving.set(true);
    this.employeeService.addCertification(this.employeeId(), this.certificationForm(), this.selectedFile!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم إضافة الشهادة بنجاح' });
        this.showCertDialog.set(false);
        this.loadProfile(this.employeeId());
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  saveDocument() {
    if (!this.selectedFile || !this.documentForm().documentTypeId) {
      this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'يرجى اختيار الملف ونوع الوثيقة' });
      return;
    }
    this.saving.set(true);
    const f = this.documentForm();
    this.employeeService.uploadDocument(this.employeeId(), this.selectedFile, f.documentTypeId, f.documentNumber, f.expiryDate).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم رفع الوثيقة بنجاح' });
        this.showDocDialog.set(false);
        this.loadProfile(this.employeeId());
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  currentCompensation = computed(() => {
    const emp = this.employee();
    if (emp?.compensation && (emp.compensation.totalSalary > 0 || emp.compensation.basicSalary > 0)) {
      return emp.compensation;
    }

    // Fallback to active contract or first contract
    const activeContract = emp?.contracts?.find(c => c.contractStatus === 'ACTIVE') || emp?.contracts?.[0];
    if (activeContract) {
      return {
        basicSalary: activeContract.basicSalary || 0,
        housingAllowance: activeContract.housingAllowance || 0,
        transportAllowance: activeContract.transportAllowance || 0,
        medicalAllowance: 0,
        totalSalary: (activeContract.basicSalary || 0) + (activeContract.housingAllowance || 0) + (activeContract.transportAllowance || 0) + (activeContract.otherAllowances || 0)
      };
    }
    return null;
  });

  getInitials(name: string): string {
    if (!name) return 'EMP';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  getProfilePictureUrl(path?: string): string | null {
    if (!path) return null;
    // If path starts with http, return as is
    if (path.startsWith('http')) return path;

    // Build full URL from backend base
    const baseUrl = 'https://localhost:5001';
    // Remove leading slash if exists to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fullUrl = `${baseUrl}/${cleanPath}`;

    console.log('Profile Picture Path:', path);
    console.log('Profile Picture URL:', fullUrl);
    return fullUrl;
  }

  // Generate avatar URL using UI Avatars service as fallback
  getAvatarUrl(name: string): string {
    const initials = this.getInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=200&background=3b82f6&color=fff&bold=true`;
  }

  onImageError(event: Event) {
    // Hide the image and show initials instead
    const img = event.target as HTMLImageElement;
    const parent = img.parentElement;
    if (parent) {
      parent.style.display = 'none';
    }
    console.error('Failed to load profile picture');
  }

  onImageLoadError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.error('❌ Failed to load profile picture from:', img.src);
    console.error('Please check:');
    console.error('1. Backend is running');
    console.error('2. UseStaticFiles() is configured');
    console.error('3. File exists at the path');
    console.error('4. CORS is properly configured');

    // Hide broken image
    img.style.display = 'none';
  }
}
