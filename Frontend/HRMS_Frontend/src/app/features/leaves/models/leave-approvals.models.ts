// Leave Approvals Models
export interface BulkApproveCommand {
    requestIds: number[];
    approvedById: number;
    notes?: string;
}

export interface BulkApproveResult {
    totalRequests: number;
    successCount: number;
    failureCount: number;
    failedRequests: FailedApproval[];
}

export interface FailedApproval {
    requestId: number;
    employeeName: string;
    reason: string;
}

export interface ApprovalStats {
    pendingCount: number;
    approvedThisMonth: number;
    rejectedThisMonth: number;
    averageApprovalTimeHours: number;
    delayedCount: number;
}

export interface TransactionReportFilters {
    fromDate?: string;
    toDate?: string;
    employeeId?: number;
    status?: string;
}

export interface LeaveTransactionReport {
    requestId: number;
    employeeId: number;
    employeeNameAr: string;
    leaveTypeNameAr: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    status: string;
    requestDate: string;
    approvedDate?: string;
    approvedByName?: string;
}

export interface PayrollLeave {
    employeeId: number;
    employeeNameAr: string;
    leaveTypeNameAr: string;
    totalDays: number;
    isDeductible: boolean;
    deductionAmount: number;
    month: number;
    year: number;
}
