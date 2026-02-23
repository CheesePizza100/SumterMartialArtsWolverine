using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Commands.UpdateEmailTemplate;

public record UpdateEmailTemplateRequest(string Name, string Subject, string Body, string? Description);

public record UpdateEmailTemplateCommand(
    int Id,
    string Name,
    string Subject,
    string Body,
    string? Description
) : IAuditableCommand
{
    public string Action => AuditActions.EmailTemplateUpdated;
    public string EntityType => "EmailTemplate";
}