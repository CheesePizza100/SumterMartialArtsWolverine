using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.EnrollInProgram;

public record EnrollInProgramRequest(int ProgramId, string ProgramName, string InitialRank);

public record EnrollInProgramCommand( int StudentId, int ProgramId, string ProgramName, string InitialRank) : IAuditableCommand
{
    public string Action => AuditActions.StudentEnrolled;
    public string EntityType => "Enrollment";
}