using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.DeactivateStudent;

public record DeactivateStudentCommandResponse(bool Success, string Message, int? StudentId) : IAuditableResponse
{
    public string EntityId => StudentId?.ToString() ?? "unknown";

    public object GetAuditDetails() => new
    {
        Success,
        Message
    };
}