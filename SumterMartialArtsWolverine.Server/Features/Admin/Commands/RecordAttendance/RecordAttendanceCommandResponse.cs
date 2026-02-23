using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.RecordAttendance;

public record RecordAttendanceCommandResponse(bool Success, string Message, int? StudentId) : IAuditableResponse
{
    public string EntityId => StudentId?.ToString() ?? "unknown";

    public object GetAuditDetails() => new
    {
        Success,
        Message
    };
}