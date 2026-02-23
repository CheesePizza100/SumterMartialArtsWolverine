using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders;
using SumterMartialArtsWolverine.Server.Services.Email.ContentBuilders.Constants;

namespace SumterMartialArtsAzure.Server.Api.Features.PrivateLessons.EventHandlers;

public class PrivateLessonRequestApprovedHandler
{
    private readonly EmailOrchestrator _emailOrchestrator;
    private readonly AppDbContext _dbContext;

    public PrivateLessonRequestApprovedHandler(EmailOrchestrator emailOrchestrator, AppDbContext dbContext)
    {
        _emailOrchestrator = emailOrchestrator;
        _dbContext = dbContext;
    }

    public async Task Handle(PrivateLessonRequestApproved domainEvent, CancellationToken cancellationToken)
    {
        var request = await _dbContext.PrivateLessonRequests
            .Include(r => r.Instructor)
            .FirstOrDefaultAsync(r => r.Id == domainEvent.RequestId, cancellationToken);

        if (request == null)
        {
            return;
        }

        await _emailOrchestrator.SendAsync(
            domainEvent.StudentEmail,
            domainEvent.StudentName,
            new SimpleEmailContentBuilder(EmailTemplateKeys.PrivateLessonApproved)
                .WithVariable("StudentName", domainEvent.StudentName)
                .WithVariable("InstructorName", request.Instructor.Name)
                .WithVariable("ScheduledDate", domainEvent.RequestedStart.ToString("MMMM dd, yyyy 'at' h:mm tt"))
        );

        // TODO: Could also send notification to instructor
        // TODO: Could create calendar invite attachment
    }
}