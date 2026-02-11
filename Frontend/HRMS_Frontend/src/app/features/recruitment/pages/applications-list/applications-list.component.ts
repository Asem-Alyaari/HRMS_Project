import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RecruitmentService } from '../../services/recruitment.service';
import { JobApplication } from '../../models/recruitment.models';

@Component({
    selector: 'app-applications-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule],
    templateUrl: './applications-list.component.html',
    styleUrls: ['./applications-list.component.scss']
})
export class ApplicationsListComponent implements OnInit {
    recruitmentService = inject(RecruitmentService);
    applications = signal<JobApplication[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.recruitmentService.getApplications().subscribe({
            next: (res) => {
                if (res.succeeded) {
                    this.applications.set(res.data);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
        switch (status) {
            case 'Accepted': return 'success';
            case 'Rejected': return 'danger';
            case 'InterviewReady': return 'info';
            case 'Pending': return 'warn';
            default: return 'secondary';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'Accepted': return 'مقبول';
            case 'Rejected': return 'مرفوض';
            case 'InterviewReady': return 'جاهز للمقابلة';
            case 'Pending': return 'قيد المراجعة';
            default: return status;
        }
    }
}
