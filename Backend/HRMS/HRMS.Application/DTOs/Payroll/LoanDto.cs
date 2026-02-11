namespace HRMS.Application.DTOs.Payroll;

public class LoanDto
{
    public int LoanId { get; set; }
    public int EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public decimal TotalAmount { get; set; }
    public int InstallmentCount { get; set; }
    public decimal MonthlyInstallment { get; set; }
    public DateTime StartDate { get; set; }
    public string? Reason { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}
