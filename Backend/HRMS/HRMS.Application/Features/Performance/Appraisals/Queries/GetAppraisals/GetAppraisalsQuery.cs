using HRMS.Application.DTOs.Performance;
using HRMS.Core.Utilities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Interfaces;

namespace HRMS.Application.Features.Performance.Appraisals.Queries.GetAppraisals;

public class GetAppraisalsQuery : IRequest<Result<List<EmployeeAppraisalDto>>>
{
    public int? EmployeeId { get; set; }
    public int? CycleId { get; set; }
}

public class GetAppraisalsQueryHandler : IRequestHandler<GetAppraisalsQuery, Result<List<EmployeeAppraisalDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAppraisalsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<EmployeeAppraisalDto>>> Handle(GetAppraisalsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.EmployeeAppraisals
            .Include(a => a.Employee)
            .Include(a => a.Cycle)
            .Include(a => a.Details)
                .ThenInclude(d => d.Kpi)
            .AsNoTracking();

        if (request.EmployeeId.HasValue)
            query = query.Where(a => a.EmployeeId == request.EmployeeId);

        if (request.CycleId.HasValue)
            query = query.Where(a => a.CycleId == request.CycleId);

        var appraisals = await query
            .Select(a => new EmployeeAppraisalDto
            {
                AppraisalId = a.AppraisalId,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee.FullNameAr,
                CycleId = a.CycleId,
                CycleName = a.Cycle.CycleNameAr,
                AppraisalDate = a.AppraisalDate,
                FinalScore = a.FinalScore ?? 0,
                Grade = a.Grade ?? "-",
                Status = a.Status ?? "DRAFT",
                Details = a.Details.Select(d => new AppraisalDetailDto
                {
                    KpiId = d.KpiId,
                    KpiName = d.Kpi.KpiNameAr,
                    Score = d.Score
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        return Result<List<EmployeeAppraisalDto>>.Success(appraisals);
    }
}
