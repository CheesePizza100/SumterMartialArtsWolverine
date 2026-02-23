using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.RecordTestResult;

public record InstructorRecordTestResponse( bool Success, string Message, int? TestResultId) : IAuditableResponse
{
    public string EntityId => TestResultId?.ToString() ?? "unknown";

    public object GetAuditDetails() => new
    {
        Success,
        Message
    };
}