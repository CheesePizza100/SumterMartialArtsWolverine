using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.Api.Features.Students.Shared;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.UpdateStudent;

public class UpdateStudentHandler
{
    private readonly AppDbContext _dbContext;

    public UpdateStudentHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UpdateStudentCommandResponse> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        var student = await _dbContext.Students
            .Include(s => s.ProgramEnrollments)
            .Include(s => s.TestHistory)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (student == null)
            throw new InvalidOperationException("Student not found");

        student.UpdateContactInfo(
            name: request.Name,
            email: request.Email,
            phone: request.Phone
        );

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateStudentCommandResponse(
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