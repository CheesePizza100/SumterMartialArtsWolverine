namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Queries.GetEmailTemplates;

public record EmailTemplateResponse(
    int Id,
    string TemplateKey,
    string Name,
    string Subject,
    string? Description,
    bool IsActive,
    DateTime LastModified
);