using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;
using SumterMartialArtsWolverine.Server.DataAccess;

namespace SumterMartialArtsWolverine.Server.Services.Email;

public class EmailOrchestrator
{
    private readonly AppDbContext _dbContext;
    private readonly EmailSender _emailSender;

    public EmailOrchestrator(
        AppDbContext dbContext,
        EmailSender emailSender)
    {
        _dbContext = dbContext;
        _emailSender = emailSender;
    }

    public async Task SendAsync(string toEmail, string toName, IEmailContentBuilder contentBuilder)
    {
        var template = await _dbContext.EmailTemplates
            .AsNoTracking()
            .SingleOrDefaultAsync(t => t.TemplateKey == contentBuilder.TemplateKey && t.IsActive);

        var emailContent = contentBuilder.BuildFrom(template.Subject, template.Body);

        await _emailSender.SendAsync(toEmail, toName, emailContent);
    }
}