using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.EnrollInProgram;

public class EnrollInProgramHandler 
{
    private readonly AppDbContext _dbContext;

    public EnrollInProgramHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<EnrollInProgramCommandResponse> Handle(EnrollInProgramCommand request, CancellationToken cancellationToken)
    {
        var student = await _dbContext.Students
            .Include(s => s.ProgramEnrollments)
            .FirstOrDefaultAsync(s => s.Id == request.StudentId, cancellationToken);

        if (student == null)
            return new EnrollInProgramCommandResponse(false, "Student not found", null);

        var enrollment = student.EnrollInProgram(
            programId: request.ProgramId,
            programName: request.ProgramName,
            initialRank: request.InitialRank
        );

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new EnrollInProgramCommandResponse(
            true,
            $"Student successfully enrolled in {request.ProgramName}",
            enrollment.Id
        );
    }
}