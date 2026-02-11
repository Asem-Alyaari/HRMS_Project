import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LeaveConfigurationService } from '../../services/leave-configuration.service';
import { SystemSetting, LeaveType, PublicHoliday } from '../../models/leave-configuration.models';
import { LeaveTypeFormComponent } from '../../../setup/pages/leave-types/leave-type-form.component';
import { ApiResponse } from '../../../../core/models/api-response';

@Component({
    selector: 'app-leave-configuration',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        TabsModule,
        ToolbarModule,
        TooltipModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService, DialogService],
    templateUrl: './leave-configuration.component.html',
    styles: [`
        :host ::ng-deep {
            .p-tabpanel-content {
                padding: 1.5rem 0;
                background: transparent;
            }
        }
    `]
})
export class LeaveConfigurationComponent implements OnInit {
    leaveConfigService = inject(LeaveConfigurationService);
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);
    dialogService = inject(DialogService);

    // Settings
    settings = signal<SystemSetting[]>([]);
    clonedSettings: { [s: string]: SystemSetting } = {};
    loadingSettings = signal(false);

    // Leave Types
    leaveTypes = signal<LeaveType[]>([]);
    loadingLeaveTypes = signal(false);

    // Public Holidays
    holidays = signal<PublicHoliday[]>([]);
    loadingHolidays = signal(false);

    ref: DynamicDialogRef | undefined;

    ngOnInit() {
        this.loadSettings();
        this.loadLeaveTypes();
        this.loadHolidays();
    }

    // ═══════════════════════════════════════════════════════════
    // System Settings Logic
    // ═══════════════════════════════════════════════════════════

    loadSettings() {
        this.loadingSettings.set(true);
        this.leaveConfigService.getSettings().subscribe({
            next: (res: ApiResponse<SystemSetting[]>) => {
                this.settings.set(res.data || []);
                this.loadingSettings.set(false);
            },
            error: () => this.loadingSettings.set(false)
        });
    }

    onRowEditInit(setting: SystemSetting) {
        this.clonedSettings[setting.settingId] = { ...setting };
    }

    onRowEditSave(setting: SystemSetting) {
        if (setting.settingValue && setting.settingValue.trim().length > 0) {
            this.leaveConfigService.updateSettings([setting]).subscribe({
                next: () => {
                    delete this.clonedSettings[setting.settingId];
                    this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم التحديث بنجاح' });
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل التحديث' })
            });
        }
    }

    onRowEditCancel(setting: SystemSetting, index: number) {
        this.settings.update(curr => {
            const up = [...curr];
            up[index] = this.clonedSettings[setting.settingId] || setting;
            return up;
        });
        delete this.clonedSettings[setting.settingId];
    }

    // ═══════════════════════════════════════════════════════════
    // Leave Types Logic
    // ═══════════════════════════════════════════════════════════

    loadLeaveTypes() {
        this.loadingLeaveTypes.set(true);
        this.leaveConfigService.getLeaveTypes().subscribe({
            next: (res: ApiResponse<LeaveType[]>) => {
                this.leaveTypes.set(res.data || []);
                this.loadingLeaveTypes.set(false);
            },
            error: () => this.loadingLeaveTypes.set(false)
        });
    }

    openLeaveTypeForm(item?: LeaveType) {
        this.ref = this.dialogService.open(LeaveTypeFormComponent, {
            header: item ? 'تعديل نوع إجازة' : 'إضافة نوع إجازة جديد',
            width: '450px',
            contentStyle: { overflow: 'visible' },
            data: item || {}
        }) as DynamicDialogRef;

        this.ref.onClose.subscribe((success) => {
            if (success) this.loadLeaveTypes();
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Public Holidays Logic
    // ═══════════════════════════════════════════════════════════

    loadHolidays() {
        this.loadingHolidays.set(true);
        this.leaveConfigService.getPublicHolidays().subscribe({
            next: (res: ApiResponse<PublicHoliday[]>) => {
                this.holidays.set(res.data || []);
                this.loadingHolidays.set(false);
            },
            error: () => this.loadingHolidays.set(false)
        });
    }
}
