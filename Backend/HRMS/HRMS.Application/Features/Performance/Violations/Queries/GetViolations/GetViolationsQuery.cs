using AutoMapper;
using HRMS.Application.DTOs.Performance;
using HRMS.Application.Interfaces;
using HRMS.Core.Utilities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Application.Features.Performance.Violations.Queries.GetViolations;

public class GetViolationsQuery : IRequest<Result<List<EmployeeViolationDto>>>
{
    public int? EmployeeId { get; set; }
    public int? ViolationTypeId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class GetViolationsQueryHandler : IRequestHandler<GetViolationsQuery, Result<List<EmployeeViolationDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetViolationsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<List<EmployeeViolationDto>>> Handle(GetViolationsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.EmployeeViolations
            .Include(v => v.Employee)
            .Include(v => v.ViolationType)
            .Include(v => v.Action)
            .AsQueryable();

        if (request.EmployeeId.HasValue)
            query = query.Where(v => v.EmployeeId == request.EmployeeId.Value);

        if (request.ViolationTypeId.HasValue)
            query = query.Where(v => v.ViolationTypeId == request.ViolationTypeId.Value);

        if (request.FromDate.HasValue)
            query = query.Where(v => v.ViolationDate >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            query = query.Where(v => v.ViolationDate <= request.ToDate.Value);

        var violations = await query
            .OrderByDescending(v => v.ViolationDate)
            .ToListAsync(cancellationToken);

        var dtos = violations.Select(v => new EmployeeViolationDto
        {
            ViolationId = v.ViolationId,
            EmployeeId = v.EmployeeId,
            EmployeeName = v.Employee.FullNameAr, // Using FullNameAr from Employee entity
            ViolationTypeId = v.ViolationTypeId,
            ViolationTypeNameAr = v.ViolationType.ViolationNameAr,
            ActionId = v.ActionId ?? 0,
            ActionNameAr = v.Action?.ActionNameAr ?? "",
            DeductionDays = v.Action != null ? (int)v.Action.DeductionDays : 0, 
            ViolationDate = v.ViolationDate,
            Description = v.Description,
            IsExecuted = v.IsExecuted == 1,
            ExecutionDate = null // Assuming not available in entity or logic not clear
        }).ToList();

        return Result<List<EmployeeViolationDto>>.Success(dtos);
    }
}
