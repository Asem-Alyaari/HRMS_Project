export interface ViolationType {
    violationTypeId: number;
    violationNameAr: string;
    severityLevel: number;
}

export interface DisciplinaryAction {
    actionId: number;
    actionNameAr: string;
    deductionDays: number;
    isTermination: boolean;
}

export interface Violation {
    violationId: number;
    employeeId: number;
    employeeName?: string;
    violationTypeId: number;
    violationTypeNameAr?: string;
    violationDate: string;
    description: string;
    actionId?: number;
    actionNameAr?: string;
    notes?: string;
    isExecuted: boolean;
    deductionDays?: number;
}

export interface RegisterViolationCommand {
    employeeId: number;
    violationTypeId: number;
    dateOfViolation: string; // ISO Date
    description: string;
    notes?: string;
}

export interface KPI {
    kpiId: number;
    kpiNameAr: string;
    category?: string;
    weight: number;
    targetValue?: number;
}

export interface AppraisalCycle {
    cycleId: number;
    cycleNameAr: string;
    startDate: string;
    endDate: string;
    status: string; // Active, Closed, Planned
}

export interface Appraisal {
    appraisalId: number;
    employeeId: number;
    employeeName?: string;
    cycleId: number;
    appraisalDate: string;
    totalScore: number;
    status: string; // Draft, Submitted, Approved
    details: AppraisalDetail[];
}

export interface AppraisalDetail {
    kpiId: number;
    kpiNameAr?: string;
    score: number;
    comments?: string;
}

export interface SubmitAppraisalCommand {
    employeeId: number;
    cycleId: number;
    appraisalDate: string;
    comments?: string;
    details: AppraisalDetail[];
}
