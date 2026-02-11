import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeaveConfigurationService } from '../../../leaves/services/leave-configuration.service';
import { PublicHoliday } from '../../../leaves/models/leave-configuration.models';
import { HolidayFormDialogComponent } from './holiday-form-dialog.component';

@Component({
    selector: 'app-public-holidays',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        ToastModule,
        ToolbarModule,
        TooltipModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService, DialogService],
    templateUrl: './public-holidays.component.html',
    styleUrls: ['./public-holidays.component.scss']
})
export class PublicHolidaysComponent implements OnInit {
    leaveConfigService = inject(LeaveConfigurationService);
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);
    dialogService = inject(DialogService);

    holidays = signal<PublicHoliday[]>([]);
    loading = signal(true);
    currentYear = new Date().getFullYear();
    ref: DynamicDialogRef | undefined | null;

    ngOnInit() {
        this.loadHolidays();
    }

    loadHolidays() {
        this.loading.set(true);
        this.leaveConfigService.getPublicHolidays(this.currentYear).subscribe({
            next: (res) => {
                const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                this.holidays.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل العطل الرسمية' });
                this.loading.set(false);
            }
        });
    }

    openNew() {
        this.ref = this.dialogService.open(HolidayFormDialogComponent, {
            header: 'إضافة عطلة رسمية جديدة',
            width: '450px',
            contentStyle: { overflow: 'visible' },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            }
        });

        this.ref?.onClose.subscribe((success: boolean) => {
            if (success) {
                this.loadHolidays();
            }
        });
    }

    deleteHoliday(holiday: PublicHoliday) {
        this.confirmationService.confirm({
            message: `هل أنت متأكد من حذف عطلة "${holiday.holidayNameAr}"؟`,
            header: 'تأكيد الحذف',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'نعم',
            rejectLabel: 'لا',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.leaveConfigService.deletePublicHoliday(holiday.holidayId).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم حذف العطلة بنجاح' });
                        this.loadHolidays();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف العطلة' });
                    }
                });
            }
        });
    }
}
