using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Logout;

public record LogoutCommand() : IAuditableCommand
{
    public string Action => AuditActions.UserLoggedOut;
    public string EntityType => "User";
};
public record LogoutCommandResponse(Guid UserId) : IAuditableResponse
{
    public string EntityId => UserId.ToString();
    public object GetAuditDetails() => new { };
}