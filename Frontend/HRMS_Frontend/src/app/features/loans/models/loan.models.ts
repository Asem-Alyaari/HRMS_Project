export interface Loan {
    loanId: number;
    employeeId: number;
    employeeName?: string;
    totalAmount: number;
    installmentCount: number;
    monthlyInstallment: number;
    startDate: string;
    reason?: string;
    status: string; // Pending, Approved, Active, Completed, Cancelled
    balance: number;
}

export interface LoanInstallment {
    installmentId: number;
    loanId: number;
    installmentNumber: number;
    amount: number;
    dueDate: string;
    paidDate?: string;
    isPaid: boolean;
    notes?: string;
}

export interface CreateLoanCommand {
    employeeId: number;
    loanAmount: number;
    installmentCount: number;
    startDate: string;
    reason?: string;
}
