using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.ChangePassword;

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

public record ChangePasswordCommand( string CurrentPassword, string NewPassword) : IAuditableCommand
{
    public string Action => AuditActions.PasswordChanged;
    public string EntityType => "User";
}