using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Entities;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetStudentAttendance;

public class GetStudentAttendanceHandler
{
    private readonly AppDbContext _dbContext;

    public GetStudentAttendanceHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetStudentAttendanceResponse> Handle(GetStudentAttendanceQuery request, CancellationToken cancellationToken)
    {
        var enrollment = await _dbContext.Set<StudentProgramEnrollment>()
            .AsNoTracking()
            .Where(e => e.StudentId == request.StudentId
                        && e.ProgramId == request.ProgramId
                        && e.IsActive)
            .Select(e => new GetStudentAttendanceResponse(
                e.Attendance.Last30Days,
                e.Attendance.Total,
                e.Attendance.AttendanceRate
            ))
            .FirstOrDefaultAsync(cancellationToken);

        return enrollment;
    }
}