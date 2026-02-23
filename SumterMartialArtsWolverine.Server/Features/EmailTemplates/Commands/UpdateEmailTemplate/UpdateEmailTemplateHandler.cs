using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Api.Features.EmailTemplates.Commands.UpdateEmailTemplate;

public class UpdateEmailTemplateHandler
{
    private readonly AppDbContext _dbContext;

    public UpdateEmailTemplateHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UpdateEmailTemplateResponse> Handle(UpdateEmailTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = await _dbContext.EmailTemplates
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

        if (template == null)
            return new UpdateEmailTemplateResponse(request.Id, false, "Email template not found");

        template.Update(request.Name, request.Subject, request.Body, request.Description);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateEmailTemplateResponse(template.Id, true, "Email template updated successfully");
    }
}