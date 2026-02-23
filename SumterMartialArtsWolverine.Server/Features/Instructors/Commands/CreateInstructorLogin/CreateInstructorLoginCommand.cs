using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.CreateInstructorLogin;

public record CreateInstructorLoginRequest(string Username, string? Password);

public record CreateInstructorLoginCommand( int InstructorId, string Username, string? Password) : IAuditableCommand
{
    public string Action => AuditActions.InstructorLoginCreated;
    public string EntityType => "User";
}