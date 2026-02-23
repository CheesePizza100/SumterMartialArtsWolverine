using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Students.Commands.UpdateMyContactInfo;

public record UpdateMyContactInfoRequest(string? Name, string? Email, string? Phone);

public record UpdateMyContactInfoCommand(string? Name, string? Email, string? Phone) :IAuditableCommand
{
    public string Action => AuditActions.StudentUpdatedOwnProfile;
    public string EntityType => "Student";
}