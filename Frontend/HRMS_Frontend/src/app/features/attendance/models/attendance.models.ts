export interface AttendanceStats {
    totalWorkDays: number;
    totalPresent: number;
    totalAbsent: number;
    totalLateMinutes: number;
    totalOvertimeMinutes: number;
    totalLeaveDays: number;
}

export interface TimesheetDay {
    date: Date | string;
    dayName: string;
    shiftName: string;
    clockIn?: Date | string;
    clockOut?: Date | string;
    workHours: number;
    lateMinutes: number;
    overtimeMinutes: number;
    status: string; // e.g., 'Present', 'Absent', 'Leave', 'Weekend'
    isException: boolean;
    exceptionType?: string;
}

export interface ManualCorrectionRequest {
    employeeId: number;
    date: string;
    clockIn?: string;
    clockOut?: string;
    reason: string;
}

export interface MonthlyClosingRequest {
    year: number;
    month: number;
}

export interface AttendanceException {
    employeeId: number;
    employeeName: string;
    date: string;
    exceptionType: string;
    details: string;
}

export interface LiveStatus {
    totalEmployees: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    onLeaveCount: number;
    recentPunches: RecentPunch[];
}

export interface RecentPunch {
    employeeId: number;
    employeeName: string;
    time: string | Date;
    type: 'In' | 'Out';
}

export interface ShiftSwapRequest {
    id: number;
    requestingEmployeeId: number;
    requestingEmployeeName: string;
    targetEmployeeId: number;
    targetEmployeeName: string;
    requestDate: string;
    targetDate: string;
    status: string;
    reason: string;
}

export interface OvertimeRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string;
    startTime: string;
    endTime: string;
    hours: number;
    reason: string;
    status: string;
}

export interface PermissionRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    reason: string;
    status: string;
}

export interface RosterDay {
    employeeId: number;
    employeeName: string;
    date: string;
    shiftId: number;
    shiftName: string;
}

export interface CorrectionHistory {
    id: number;
    employeeId: number;
    date: string;
    originalClockIn?: string;
    originalClockOut?: string;
    correctedClockIn?: string;
    correctedClockOut?: string;
    reason: string;
    correctedBy: string;
    correctedAt: string;
}

export interface PayrollAttendanceSummary {
    employeeId: number;
    employeeName: string;
    workingDays: number;
    actualDays: number;
    lateMinutes: number;
    overtimeMinutes: number;
    absenceDays: number;
    deductionDays: number;
}
