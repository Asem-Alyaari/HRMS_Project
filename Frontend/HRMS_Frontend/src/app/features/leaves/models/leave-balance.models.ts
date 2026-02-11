// Leave Balance Models
export interface InitializeBalancesDto {
    leaveTypeId?: number;
    year: number;
    departmentId?: number;
    customDays?: number;
    enableProration: boolean;
}

export interface AdjustBalanceCommand {
    employeeId: number;
    leaveTypeId: number;
    year: number;
    adjustmentDays: number;
    reason: string;
}

export interface EmployeeBalanceDetail {
    employeeId: number;
    employeeNameAr: string;
    employeeNameEn: string;
    departmentNameAr?: string;
    balances: LeaveBalanceInfo[];
}

export interface LeaveBalanceInfo {
    leaveTypeId: number;
    leaveTypeNameAr: string;
    year: number;
    totalBalance: number;
    usedBalance: number;
    remainingBalance: number;
}
