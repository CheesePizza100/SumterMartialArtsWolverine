using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.RecordAttendance;

public class RecordAttendanceHandler
{
    private readonly AppDbContext _dbContext;

    public RecordAttendanceHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RecordAttendanceCommandResponse> Handle(RecordAttendanceCommand request, CancellationToken cancellationToken) {
        var student = await _dbContext.Students
            .Include(s => s.ProgramEnrollments)
            .FirstOrDefaultAsync(s => s.Id == request.StudentId, cancellationToken);

        if (student == null)
            return new RecordAttendanceCommandResponse(false, "Student not found", null);

        student.RecordAttendance(request.ProgramId, request.ClassesAttended);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new RecordAttendanceCommandResponse(
            true,
            $"Recorded {request.ClassesAttended} class(es) for student",
            student.Id
        );
    }
}