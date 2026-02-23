using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.CreateStudent;

public record CreateStudentRequest(
    string Name,
    string Email,
    string Phone
);

public record CreateStudentCommand(string Name, string Email, string Phone)
    : IAuditableCommand
{
    public string Action => AuditActions.StudentCreated;
    public string EntityType => "Student";
}