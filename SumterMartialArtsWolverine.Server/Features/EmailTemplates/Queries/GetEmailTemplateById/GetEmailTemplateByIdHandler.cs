using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Queries.GetEmailTemplateById;

public class GetEmailTemplateByIdHandler
{
    private readonly AppDbContext _dbContext;

    public GetEmailTemplateByIdHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<EmailTemplateDetailResponse?> Handle(GetEmailTemplateByIdQuery request, CancellationToken cancellationToken)
    {
        return _dbContext.EmailTemplates
            .AsNoTracking()
            .Where(t => t.Id == request.Id)
            .Select(t => new EmailTemplateDetailResponse(
                t.Id,
                t.TemplateKey,
                t.Name,
                t.Subject,
                t.Body,
                t.Description,
                t.IsActive
            )).FirstOrDefaultAsync(cancellationToken);
    }
}