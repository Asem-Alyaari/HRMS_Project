import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AttendanceService } from '../../services/attendance.service';
import { LiveStatus, AttendanceException } from '../../models/attendance.models';

@Component({
    selector: 'app-attendance-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, TableModule, TagModule, ButtonModule],
    templateUrl: './attendance-dashboard.component.html',
    styleUrls: ['./attendance-dashboard.component.scss']
})
export class AttendanceDashboardComponent implements OnInit {
    attendanceService = inject(AttendanceService);

    liveStatus = signal<LiveStatus | null>(null);
    exceptions = signal<AttendanceException[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);

        this.attendanceService.getLiveStatus().subscribe({
            next: (res) => {
                if (res.succeeded) this.liveStatus.set(res.data);
            }
        });

        this.attendanceService.getExceptions().subscribe({
            next: (res) => {
                if (res.succeeded) this.exceptions.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getTypeLabel(type: string): string {
        return type === 'In' ? 'دخول' : 'خروج';
    }

    getTypeSeverity(type: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
        return type === 'In' ? 'success' : 'info';
    }
}
