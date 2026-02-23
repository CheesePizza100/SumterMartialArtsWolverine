using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Login;

public record LoginCommandResponse(string Token, string Username, Guid UserId, string Role, bool MustChangePassword) : IAuditableResponse
{
    public string EntityId => UserId.ToString();

    public object GetAuditDetails() => new
    {
        Username
    };
}