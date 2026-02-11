using HRMS.Application.Interfaces;
using HRMS.Core.Utilities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Application.Features.Payroll.Loans.Commands.UpdateLoanStatus;

public class UpdateLoanStatusCommand : IRequest<Result<bool>>
{
    public int LoanId { get; set; }
    public string Status { get; set; } = string.Empty; // APPROVED, REJECTED, ACTIVE
    public string? AdminNotes { get; set; }
}

public class UpdateLoanStatusCommandHandler : IRequestHandler<UpdateLoanStatusCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public UpdateLoanStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(UpdateLoanStatusCommand request, CancellationToken cancellationToken)
    {
        var loan = await _context.Loans
            .Include(l => l.Installments)
            .FirstOrDefaultAsync(l => l.LoanId == request.LoanId, cancellationToken);

        if (loan == null) return Result<bool>.Failure("القرض غير موجود");

        loan.Status = request.Status;
        // In a real system, you might add audit logs or notes here

        await _context.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true, "تم تحديث حالة القرض بنجاح");
    }
}
