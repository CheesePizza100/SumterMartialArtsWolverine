using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.UpdateStudent;

public record UpdateStudentRequest(string? Name, string? Email, string? Phone);

public record UpdateStudentCommand( int Id, string? Name, string? Email, string? Phone) : IAuditableCommand
{
    public string Action => AuditActions.StudentUpdated;
    public string EntityType => "Student";
}