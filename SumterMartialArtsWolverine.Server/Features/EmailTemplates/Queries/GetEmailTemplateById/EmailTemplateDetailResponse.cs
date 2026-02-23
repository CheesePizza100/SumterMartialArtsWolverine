namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Queries.GetEmailTemplateById;

public record EmailTemplateDetailResponse(
    int Id,
    string TemplateKey,
    string Name,
    string Subject,
    string Body,
    string? Description,
    bool IsActive
);