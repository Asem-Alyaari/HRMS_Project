// Leave Configuration Models
export interface SystemSetting {
    settingId: number;
    settingKey: string;
    settingValue: string;
    description?: string;
    category?: string;
}

export interface PublicHoliday {
    holidayId: number;
    holidayNameAr: string;
    holidayNameEn: string;
    holidayDate: Date | string;
    year: number;
    isRecurring: boolean;
}

export interface CreatePublicHoliday {
    holidayNameAr: string;
    holidayNameEn: string;
    holidayDate: string;
    isRecurring: boolean;
}
