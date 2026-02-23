using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Commands.CreateInstructorLogin;

public record CreateInstructorLoginResponse(
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
        Username
    };
}