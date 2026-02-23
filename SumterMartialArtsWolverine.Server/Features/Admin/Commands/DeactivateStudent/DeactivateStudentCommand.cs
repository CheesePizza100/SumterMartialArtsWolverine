
using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.DeactivateStudent;

public record DeactivateStudentCommand(int StudentId) : IAuditableCommand
{
    public string Action => AuditActions.StudentDeactivated;
    public string EntityType => "Student";
}