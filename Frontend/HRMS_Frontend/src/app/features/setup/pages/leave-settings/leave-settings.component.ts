import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { LeaveConfigurationService } from '../../../leaves/services/leave-configuration.service';
import { SystemSetting } from '../../../leaves/models/leave-configuration.models';

@Component({
    selector: 'app-leave-settings',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        ToolbarModule
    ],
    providers: [MessageService],
    templateUrl: './leave-settings.component.html',
    styleUrls: ['./leave-settings.component.scss']
})
export class LeaveSettingsComponent implements OnInit {
    leaveConfigService = inject(LeaveConfigurationService);
    messageService = inject(MessageService);

    settings = signal<SystemSetting[]>([]);
    clonedSettings: { [s: string]: SystemSetting } = {};
    loading = signal(true);

    ngOnInit() {
        this.loadSettings();
    }

    loadSettings() {
        this.loading.set(true);
        this.leaveConfigService.getSettings().subscribe({
            next: (res) => {
                // Adjust based on actual API response structure (checking if data is array or wrapped)
                const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                this.settings.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading settings:', err);
                this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل الإعدادات' });
                this.loading.set(false);
            }
        });
    }

    onRowEditInit(setting: SystemSetting) {
        this.clonedSettings[setting.settingId] = { ...setting };
    }

    onRowEditSave(setting: SystemSetting) {
        if (setting.settingValue.trim().length > 0) {
            this.leaveConfigService.updateSettings([setting]).subscribe({
                next: () => {
                    delete this.clonedSettings[setting.settingId];
                    this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث الإعداد بنجاح' });
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحديث الإعداد' });
                    // Revert
                    const index = this.settings().findIndex(s => s.settingId === setting.settingId);
                    if (index > -1 && this.clonedSettings[setting.settingId]) {
                        this.settings.update(current => {
                            const updated = [...current];
                            updated[index] = this.clonedSettings[setting.settingId];
                            return updated;
                        });
                    }
                }
            });
        } else {
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'القيمة مطلوبة' });
        }
    }

    onRowEditCancel(setting: SystemSetting, index: number) {
        this.settings.update(current => {
            const updated = [...current];
            updated[index] = this.clonedSettings[setting.settingId];
            return updated;
        });
        delete this.clonedSettings[setting.settingId];
    }
}
