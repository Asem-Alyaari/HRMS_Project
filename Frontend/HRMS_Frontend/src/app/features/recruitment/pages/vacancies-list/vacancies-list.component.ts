import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RecruitmentService } from '../../services/recruitment.service';
import { Vacancy } from '../../models/recruitment.models';

@Component({
    selector: 'app-vacancies-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule],
    templateUrl: './vacancies-list.component.html',
    styleUrls: ['./vacancies-list.component.scss']
})
export class VacanciesListComponent implements OnInit {
    recruitmentService = inject(RecruitmentService);
    vacancies = signal<Vacancy[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.recruitmentService.getVacancies().subscribe({
            next: (res) => {
                if (res.succeeded) {
                    this.vacancies.set(res.data);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
        switch (status) {
            case 'Open': return 'success';
            case 'Closed': return 'danger';
            case 'OnHold': return 'warn';
            default: return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'Open': return 'مفتوحة';
            case 'Closed': return 'مغلقة';
            case 'OnHold': return 'معلقة';
            default: return status;
        }
    }
}
