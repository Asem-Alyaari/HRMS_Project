export interface Payslip {
    payslipId: number;
    employeeId: number;
    month: number;
    year: number;
    basicSalary: number;
    totalAllowances: number;
    totalDeductions: number;
    netSalary: number;
    overtimeEarnings: number;
}

export interface AllowanceDetail {
    elementNameAr: string;
    amount: number;
}

export interface DeductionDetail {
    elementNameAr: string;
    amount: number;
}

export interface PayrollRun {
    runId: number;
    month: number;
    year: number;
    status: string; // 'Draft', 'Processed', 'Posted'
    totalNet: number;
    employeeCount: number;
    runDate: string;
}

export interface EmployeeStructureItem {
    structureId: number;
    elementId: number;
    elementNameAr: string;
    elementType: string;
    amount: number;
    percentage: number;
}

export interface EmployeeSalaryStructure {
    employeeId: number;
    employeeName: string;
    jobTitleAr: string;
    gradeNameAr: string;
    elements: EmployeeStructureItem[];
    totalEarnings: number;
    totalDeductions: number;
    netSalary: number;
}
