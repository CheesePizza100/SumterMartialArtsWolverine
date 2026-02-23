using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.EnrollInProgram;

public record EnrollInProgramCommandResponse( bool Success, string Message, int? EnrollmentId) : IAuditableResponse
{
    public string EntityId => EnrollmentId?.ToString() ?? "unknown";

    public object GetAuditDetails() => new
    {
        Success,
        Message
    };
}