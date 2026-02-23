using SumterMartialArtsWolverine.Server.Api.Auditing;

namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Commands.UpdateEmailTemplate;

public record UpdateEmailTemplateResponse(int TemplateId, bool Success, string Message) : IAuditableResponse
{
    public string EntityId => TemplateId.ToString();

    public object GetAuditDetails() => new
    {
        Success,
        Message
    };
}