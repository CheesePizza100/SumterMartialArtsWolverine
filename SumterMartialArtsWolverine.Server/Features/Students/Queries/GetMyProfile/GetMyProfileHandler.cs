using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.Api.Features.Students.Shared;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Services;

namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetMyProfile;

public class GetMyProfileHandler
{
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMyProfileHandler(AppDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<StudentProfileResponse> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
    {
        var studentId = _currentUserService.GetStudentId();

        if (studentId == null)
            throw new UnauthorizedAccessException("User is not associated with a student");

        var student = await _dbContext.Students
            .Include(s => s.ProgramEnrollments)
            .Include(s => s.TestHistory)
            .FirstOrDefaultAsync(s => s.Id == studentId.Value);

        if (student == null)
            throw new InvalidOperationException("Student not found");

        return new StudentProfileResponse(
            student.Id,
            student.Name,
            student.Email,
            student.Phone,
            student.ProgramEnrollments
                .Where(e => e.IsActive)
                .Select(e => new ProgramEnrollmentDto(
                    e.ProgramId,
                    e.ProgramName,
                    e.CurrentRank,
                    e.EnrolledDate,
                    e.LastTestDate,
                    e.InstructorNotes,
                    new AttendanceDto(
                        e.Attendance.Last30Days,
                        e.Attendance.Total,
                        e.Attendance.AttendanceRate)
                )).ToList(),
            student.TestHistory
                .OrderByDescending(t => t.TestDate)
                .Select(t => new TestHistoryDto(
                    t.TestDate,
                    t.ProgramName,
                    t.RankAchieved,
                    t.Result,
                    t.Notes
                )).ToList()
        );
    }
}