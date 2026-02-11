import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
    selector: 'app-attendance-punch',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CardModule, ToastModule],
    providers: [MessageService],
    templateUrl: './attendance-punch.component.html'
})
export class AttendancePunchComponent implements OnInit, OnDestroy {
    private attendanceService = inject(AttendanceService);
    private messageService = inject(MessageService);
    private authService = inject(AuthService);

    currentTime = signal<Date>(new Date());
    timerId: any;
    loading = signal(false);

    ngOnInit() {
        this.timerId = setInterval(() => {
            this.currentTime.set(new Date());
        }, 1000);
    }

    ngOnDestroy() {
        if (this.timerId) clearInterval(this.timerId);
    }

    registerPunch(type: 'IN' | 'OUT') {
        this.loading.set(true);

        // Use the signal from AuthService
        const user = this.authService.currentUser();
        const employeeId = user?.employeeId || 1;

        const command = {
            employeeId: employeeId,
            punchType: type,
            punchTime: new Date().toISOString(),
            deviceId: 'WEB_APP',
            locationCoordinates: '0,0'
        };

        this.attendanceService.registerPunch(command).subscribe({
            next: (res: any) => {
                const message = type === 'IN' ? 'تم تسجيل حضورك بنجاح' : 'تم تسجيل انصرافك بنجاح';
                this.messageService.add({
                    severity: 'success',
                    summary: 'تم التسجيل',
                    detail: message,
                    life: 5000
                });
                this.loading.set(false);
            },
            error: (err: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'خطأ',
                    detail: 'فشل في تسجيل البصمة. يرجى المحاولة لاحقاً'
                });
                this.loading.set(false);
            }
        });
    }
}
