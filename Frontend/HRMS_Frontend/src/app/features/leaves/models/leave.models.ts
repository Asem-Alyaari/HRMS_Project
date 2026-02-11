export interface LeaveRequest {
    requestId: number;
    employeeId: number;
    employeeNameAr?: string;
    employeeNameEn?: string;
    leaveTypeId: number;
    leaveTypeNameAr?: string;
    startDate: Date | string;
    endDate: Date | string;
    requestDate: Date | string;
    totalDays: number;
    reason: string;
    status: string; // 'Pending', 'Approved', 'Rejected', 'Cancelled'
    approvedById?: number;
    approvedDate?: Date | string;
    notes?: string;
}

export interface CreateLeaveRequest {
    employeeId: number;
    leaveTypeId: number;
    startDate: string;
    endDate: string;
    reason: string;
}

export interface LeaveActionRequest {
    requestId: number;
    notes?: string;
}

export interface LeaveBalance {
    leaveTypeId: number;
    leaveTypeNameAr: string;
    totalBalance: number;
    usedBalance: number;
    remainingBalance: number;
}
