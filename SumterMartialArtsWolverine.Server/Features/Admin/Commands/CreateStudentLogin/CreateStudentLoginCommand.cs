using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.CreateStudentLogin;

public record CreateStudentLoginRequest(string Username, string? Password);

public record CreateStudentLoginCommand(
    int StudentId,
    string Username,
    string Password
) : IAuditableCommand
{
    public string Action => AuditActions.StudentLoginCreated;
    public string EntityType => "User";
}