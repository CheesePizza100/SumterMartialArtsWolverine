using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.ChangePassword;

public record ChangePasswordCommandResponse( bool Success, string Message, string UserId) : IAuditableResponse
{
    public string EntityId => UserId;

    public object GetAuditDetails() => new
    {
        Success,
        Message
    };
}