using HRMS.Application.DTOs.Payroll;
using HRMS.Application.Interfaces;
using HRMS.Core.Utilities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Application.Features.Payroll.Loans.Queries.GetLoans;

public class GetLoansQuery : IRequest<Result<List<LoanDto>>>
{
    public string? Status { get; set; }
    public int? EmployeeId { get; set; }
}

public class GetLoansQueryHandler : IRequestHandler<GetLoansQuery, Result<List<LoanDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetLoansQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<LoanDto>>> Handle(GetLoansQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Loans
            .Include(l => l.Employee)
            .Include(l => l.Installments)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Status))
            query = query.Where(l => l.Status == request.Status);

        if (request.EmployeeId.HasValue)
            query = query.Where(l => l.EmployeeId == request.EmployeeId);

        var loans = await query
            .OrderByDescending(l => l.RequestDate)
            .ToListAsync(cancellationToken);

        var dtos = loans.Select(l => new LoanDto
        {
            LoanId = l.LoanId,
            EmployeeId = l.EmployeeId,
            EmployeeName = l.Employee.FullNameAr,
            TotalAmount = l.LoanAmount,
            InstallmentCount = l.InstallmentCount,
            MonthlyInstallment = l.InstallmentCount > 0 ? l.LoanAmount / l.InstallmentCount : 0,
            StartDate = l.RequestDate, // Defaulting to request date for now
            Status = l.Status ?? "PENDING",
            Balance = l.LoanAmount - l.Installments.Where(i => i.IsPaid == 1).Sum(i => i.Amount)
        }).ToList();

        return Result<List<LoanDto>>.Success(dtos);
    }
}
