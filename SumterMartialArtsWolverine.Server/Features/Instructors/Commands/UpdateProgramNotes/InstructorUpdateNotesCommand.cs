using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.UpdateProgramNotes;

public record InstructorUpdateNotesRequest(string Notes);

public record InstructorUpdateNotesCommand( int StudentId, int ProgramId, string Notes) : IAuditableCommand
{
    public string Action => AuditActions.InstructorUpdatedNotes;
    public string EntityType => "Enrollment";
}