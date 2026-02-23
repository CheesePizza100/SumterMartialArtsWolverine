using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.CreateStudentLogin;

public record CreateStudentLoginCommandResponse(
    bool Success,
    string Message,
    string Username,
    string TemporaryPassword,
    string UserId
) : IAuditableResponse
{
    public string EntityId => UserId;

    public object GetAuditDetails() => new
    {
        Username,
        StudentId = UserId
    };
}