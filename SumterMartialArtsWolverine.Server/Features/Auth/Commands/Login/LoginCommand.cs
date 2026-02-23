using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Login;

public record LoginRequest(string UserName, string Password);

public record LoginCommand(string Username, string Password) : IAuditableCommand
{
    public string Action => AuditActions.UserLoggedIn;
    public string EntityType => "User";
}